import { Worker } from "bullmq";
import { connection as redisConnection } from "../lib/redis.js";
import { getDownloadCollection } from "../lib/database.js";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import express from "express";

const app = express();
const PORT = process.env.PORT || process.env.WORKER_PORT || 5050;
app.get("/", (req, res) => res.send("Worker is running."));

app.listen(PORT, () => {
  console.log(`🚀 Worker server running on port ${PORT}`);
});

// Check if yt-dlp is available
function checkYtDlp() {
  return new Promise((resolve) => {
    const check = spawn("which", ["yt-dlp"]);
    check.on("close", (code) => {
      if (code === 0) {
        console.log("✅ yt-dlp is available");
        resolve(true);
      } else {
        console.log("❌ yt-dlp not found, trying alternative installation...");
        resolve(false);
      }
    });
  });
}

// Try to install yt-dlp if not available
async function ensureYtDlp() {
  const isAvailable = await checkYtDlp();
  if (!isAvailable) {
    console.log("🔧 Attempting to install yt-dlp...");
    try {
      // Try pip3 install
      const install = spawn("pip3", ["install", "--user", "yt-dlp"]);
      install.on("close", (code) => {
        if (code === 0) {
          console.log("✅ yt-dlp installed successfully");
        } else {
          console.log("❌ Failed to install yt-dlp");
        }
      });
    } catch (error) {
      console.log("❌ Error installing yt-dlp:", error.message);
    }
  }
}

// Initialize yt-dlp
ensureYtDlp();

// Create cookies file from environment variable if available
if (process.env.YOUTUBE_COOKIES) {
  try {
    const cookiesPath = path.join(process.cwd(), "cookies", "youtube_cookies.txt");
    fs.writeFileSync(cookiesPath, process.env.YOUTUBE_COOKIES);
    console.log("✅ YouTube cookies created from environment variable");
  } catch (error) {
    console.log("❌ Error creating cookies file:", error.message);
  }
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
    const args = [
      "--verbose", 
      "--newline", 
      "--progress", 
      "--no-warnings",
      "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "--sleep-interval", "2",
      "--max-sleep-interval", "5",
      "--extractor-args", "youtube:player_client=android",
      "--no-check-certificates",
      "--prefer-insecure",
      "-f", format, 
      "-o", outputPath
    ];
    
    // Add cookies if available
    let cookiesPath = null;
    
    // First try environment variable
    if (process.env.YOUTUBE_COOKIES) {
      console.log(`🔧 Creating cookies file from environment variable`);
      cookiesPath = path.join(process.cwd(), "cookies", "youtube_cookies.txt");
      try {
        fs.writeFileSync(cookiesPath, process.env.YOUTUBE_COOKIES);
        console.log(`✅ Cookies file created from environment variable`);
      } catch (error) {
        console.log(`❌ Error creating cookies file:`, error.message);
        cookiesPath = null;
      }
    } else {
      // Try existing file
      cookiesPath = path.join(process.cwd(), "cookies", "youtube_cookies.txt");
      console.log(`🔍 Looking for cookies at: ${cookiesPath}`);
      console.log(`📁 Current working directory: ${process.cwd()}`);
      
      try {
        const cookiesDir = path.join(process.cwd(), "cookies");
        if (fs.existsSync(cookiesDir)) {
          console.log(`📁 Cookies directory contents:`, fs.readdirSync(cookiesDir));
        } else {
          console.log(`❌ Cookies directory does not exist`);
        }
      } catch (error) {
        console.log(`❌ Error reading cookies directory:`, error.message);
      }
    }
    
    if (cookiesPath && fs.existsSync(cookiesPath)) {
      console.log(`✅ Cookies file found, adding to yt-dlp arguments`);
      args.push("--cookies", cookiesPath);
    } else {
      console.log(`❌ No cookies available, proceeding without authentication`);
    }
    
    if (startTime && endTime) {
      args.push("--download-sections", `*${startTime}-${endTime}`);
    }
    args.push(url);

    console.log(`🚀 Starting yt-dlp for job ${job.id} with args:`, args);

    return new Promise((resolve, reject) => {
      const downloadProcess = spawn("yt-dlp", args); // Use correct path if needed
      let stderrBuffer = "";
      let stdoutBuffer = "";

      // 🔹 Capture progress updates
      downloadProcess.stdout.on("data", async (data) => {
        const output = data.toString();
        stdoutBuffer += output;
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