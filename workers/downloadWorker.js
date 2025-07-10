import { Worker } from "bullmq";
import { connection as redisConnection } from "../lib/redis.js";
import { getDownloadCollection } from "../lib/database.js";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import express from "express";

const app = express();
const PORT = process.env.WORKER_PORT || 5050;
app.get("/", (req, res) => res.send("Worker is running."));
app.listen(PORT);

// 🔹 Helper function to update MongoDB progress
async function updateDownloadRecord(downloadId, updateFields) {
  try {
    const downloads = await getDownloadCollection();
    const result = await downloads.updateOne(
      { downloadId },
      { $set: { ...updateFields, lastUpdated: new Date() } },
      { upsert: true }
    );
    console.log(`✅ Updated progress in MongoDB for ${downloadId}:`, updateFields);
  } catch (error) {
    console.error("❌ Error updating MongoDB record:", error);
  }
}

// 🔹 Create a BullMQ Worker
const worker = new Worker(
  "downloadQueue",
  async (job) => {
    const { url, format, startTime, endTime, downloadId } = job.data;

    // 🔹 Ensure downloads directory exists
    const downloadsDir = path.join(process.cwd(), "downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    // 🔹 Set output file path
    const outputFilename = `${downloadId}.${format}`;
    const outputPath = path.join(downloadsDir, outputFilename);

    // 🔹 Build yt-dlp arguments
    const args = ["--verbose", "--newline", "--progress", "--no-warnings", "-f", format, "-o", outputPath];
    if (startTime && endTime) {
      args.push("--download-sections", `*${startTime}-${endTime}`);
    }
    args.push(url);

    console.log(`🚀 Starting yt-dlp for job ${job.id} with args:`, args);

    return new Promise((resolve, reject) => {
      const downloadProcess = spawn("yt-dlp", args); // Use correct path if needed
      let stderrBuffer = "";

      // 🔹 Capture progress updates
      downloadProcess.stdout.on("data", async (data) => {
        const output = data.toString();
        // Print every line for debugging
        output.split("\n").forEach(line => {
          if (line.trim()) {
            console.log(`[yt-dlp] ${line.trim()}`);
          }
        });
        // Try to match progress percentage in each line
        const match = output.match(/(\d+(?:\.\d+)?)%/);
        if (match && match[1]) {
          const progress = parseFloat(match[1]);
          console.log(`⬆️ Progress Update: ${progress}%`);
          await updateDownloadRecord(downloadId, { progress, status: "downloading" });
        }
      });

      // 🔹 Capture errors
      downloadProcess.stderr.on("data", async (data) => {
        const output = data.toString();
        console.error(`yt-dlp stderr: ${output.trim()}`);
        stderrBuffer += output;
      });

      // 🔹 On Process Close
      downloadProcess.on("close", async (code) => {
        console.log(`yt-dlp process exited with code ${code}`);
        if (code === 0) {
          await updateDownloadRecord(downloadId, {
            progress: 100,
            status: "completed",
            filePath: outputPath,
          });
          resolve();
        } else {
          await updateDownloadRecord(downloadId, {
            progress: 0,
            status: "failed",
            error: stderrBuffer || `yt-dlp exited with code ${code}`,
          });
          reject(new Error(`yt-dlp exited with code ${code}`));
        }
      });

      // 🔹 Handle process errors
      downloadProcess.on("error", async (error) => {
        console.error("Download process encountered an error:", error);
        await updateDownloadRecord(downloadId, {
          progress: 0,
          status: "failed",
          error: error.message,
        });
        reject(error);
      });
    });
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed successfully.`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});