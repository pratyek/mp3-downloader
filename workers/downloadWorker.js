import { Worker } from "bullmq";
import IORedis from "ioredis";
import { MongoClient } from "mongodb";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import express from "express";

const app = express();
const PORT = process.env.PORT || 5050;
app.get("/", (req, res) => res.send("Worker is running."));
app.listen(PORT);

// 🔹 Set up Redis connection
const redisUrl = 'rediss://default:Aex7AAIjcDFhZDlhNzdhOWJiODM0MWE5OGY4MDBiMDFmMDg3OWM2NHAxMA@musical-ghost-60539.upstash.io:6379' || "redis://localhost:6379";
const redisConnection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

// 🔹 MongoDB Connection
const mongoUri = 'mongodb+srv://pratyekpk3:pratyek@cluster0.7hlp9.mongodb.net/mp3-mp4-downloader?retryWrites=true&w=majority' || "mongodb://localhost:27017/youtube-downloader";
const mongoClient = new MongoClient(mongoUri);

async function getDownloadCollection() {
  if (!mongoClient.topology || mongoClient.topology.s.state !== "connected") {
    await mongoClient.connect();
  }
  return mongoClient.db("youtube-downloader").collection("downloads");
}

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
    const args = ["--verbose", "--newline", "--progress", "--no-warnings", "-f", "best", "-o", outputPath];
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
        console.log(`yt-dlp stdout: ${output.trim()}`);

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
