// workers/downloadWorker.js
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { MongoClient } from 'mongodb';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log("rediss://default:Aex7AAIjcDFhZDlhNzdhOWJiODM0MWE5OGY4MDBiMDFmMDg3OWM2NHAxMA@musical-ghost-60539.upstash.io:6379");
// Set up Redis connection for BullMQ
const redisUrl = "rediss://default:Aex7AAIjcDFhZDlhNzdhOWJiODM0MWE5OGY4MDBiMDFmMDg3OWM2NHAxMA@musical-ghost-60539.upstash.io:6379" || 'redis://localhost:6379';
const redisConnection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

// Set up MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-downloader';
const mongoClient = new MongoClient(mongoUri);

async function getDownloadCollection() {
  if (!mongoClient.isConnected || !mongoClient.isConnected()) {
    await mongoClient.connect();
  }
  const db = mongoClient.db('youtube-downloader');
  return db.collection('downloads');
}

// Helper function to update a download record in MongoDB
async function updateDownloadRecord(downloadId, updateFields) {
  try {
    const downloads = await getDownloadCollection();
    await downloads.updateOne(
      { downloadId },
      { $set: { ...updateFields, lastUpdated: new Date() } }
    );
  } catch (error) {
    console.error('Error updating MongoDB record:', error);
  }
}

// Create a BullMQ worker that listens for 'downloadJob' jobs
const worker = new Worker(
  'downloadQueue',
  async (job) => {
    const { url, format, startTime, endTime, downloadId } = job.data;

    // Ensure the downloads directory exists
    const downloadsDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    // Create an output filename and full path for the downloaded file
    const outputFilename = `${downloadId}.${format}`;
    const outputPath = path.join(downloadsDir, outputFilename);

    // Build the yt-dlp arguments
    const args = [
      '--verbose',
      '--newline',
      '--progress',
      '--no-warnings',
      '-f',
      'best',
      '-o',
      outputPath,
    ];
    if (startTime && endTime) {
      args.push('--download-sections', `*${startTime}-${endTime}`);
    }
    args.push(url);

    console.log(`Starting yt-dlp for job ${job.id} with args:`, args);

    // Return a promise that resolves when the download is finished
    return new Promise((resolve, reject) => {
      const downloadProcess = spawn('/opt/homebrew/bin/yt-dlp', args);
      let stderrBuffer = '';

      downloadProcess.stdout.on('data', async (data) => {
        const output = data.toString();
        console.log(`yt-dlp stdout: ${output.trim()}`);
        const match = output.match(/(\d+\.\d+)%/);
        if (match && match[1]) {
          const progress = parseFloat(match[1]);
          await updateDownloadRecord(downloadId, { progress, status: 'downloading' });
        }
      });

      downloadProcess.stderr.on('data', async (data) => {
        const output = data.toString();
        console.error(`yt-dlp stderr: ${output.trim()}`);
        stderrBuffer += output;
      });

      downloadProcess.on('close', async (code) => {
        console.log(`yt-dlp process exited with code ${code}`);
        if (code === 0) {
          // On success, update the record with 100% progress and file path
          await updateDownloadRecord(downloadId, {
            progress: 100,
            status: 'completed',
            filePath: outputPath,
          });
          resolve();
        } else {
          // On failure, update the record with an error message
          await updateDownloadRecord(downloadId, {
            progress: 0,
            status: 'failed',
            error: stderrBuffer || `yt-dlp exited with code ${code}`,
          });
          reject(new Error(`yt-dlp exited with code ${code}`));
        }
      });

      downloadProcess.on('error', async (error) => {
        console.error('Download process encountered an error:', error);
        await updateDownloadRecord(downloadId, {
          progress: 0,
          status: 'failed',
          error: error.message,
        });
        reject(error);
      });
    });
  },
  { connection: redisConnection }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed successfully.`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});
