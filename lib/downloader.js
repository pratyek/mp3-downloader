import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { getDownloadCollection } from './mongodb';
import { v4 as uuidv4 } from 'uuid';

// Store download progress for different download IDs
// Using global variable to persist across API requests
global.downloadProgress = global.downloadProgress || {};

// Initialize with some default values to ensure the UI shows something
export function getDownloadProgress(downloadId) {
  if (!global.downloadProgress[downloadId]) {
    // Create a new entry if one doesn't exist
    global.downloadProgress[downloadId] = { progress: 0, status: 'initializing' };
  }
  return global.downloadProgress[downloadId];
}

export async function checkVideoExists(url, format) {
  const downloads = await getDownloadCollection();
  const existingDownload = await downloads.findOne({ url, format });
  
  if (existingDownload && fs.existsSync(existingDownload.filePath)) {
    return existingDownload;
  }
  
  return null;
}

// Check if there are any active downloads
export async function getActiveDownloads() {
  const downloads = await getDownloadCollection();
  const activeDownloads = await downloads.find({ status: { $in: ['downloading', 'processing'] } }).toArray();
  return activeDownloads;
}

// Persist download progress to database
async function updateDownloadProgress(downloadId, progress, status) {
  try {
    const downloads = await getDownloadCollection();
    await downloads.updateOne(
      { downloadId },
      { $set: { progress, status, lastUpdated: new Date() } }
    );
  } catch (error) {
    console.error('Failed to update download progress in DB:', error);
  }
}

export async function downloadYouTubeVideo(url, format, startTime = null, endTime = null) {
  // Generate unique ID for this download
  const downloadId = uuidv4();
  
  // Set initial progress
  global.downloadProgress[downloadId] = { progress: 0, status: 'starting' };
  
  // Create downloads directory if it doesn't exist
  const downloadsDir = path.join(process.cwd(), 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }
  
  // Generate output filename based on format
  const outputFilename = `${downloadId}.${format}`;
  const outputPath = path.join(downloadsDir, outputFilename);
  
  // Create initial database entry
  try {
    const downloads = await getDownloadCollection();
    await downloads.insertOne({
      url,
      format,
      downloadId,
      progress: 0,
      status: 'starting',
      clipInfo: startTime && endTime ? { startTime, endTime } : null,
      createdAt: new Date(),
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Failed to create download entry in DB:', error);
  }
  
  // Prepare yt-dlp arguments
  let args = [
    '--newline',
    '--progress',
    '-f', 'best',
    '-o', outputPath
  ];
  
  // Add clip options if provided
  if (startTime && endTime) {
    args.push('--download-sections');
    args.push(`*${startTime}-${endTime}`);
  }
  
  // Add the URL at the end
  args.push(url);
  
  // Start the download process in a detached child process
  const childProcess = spawn('yt-dlp', args, {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Update status to downloading
  global.downloadProgress[downloadId] = { progress: 0, status: 'downloading' };
  await updateDownloadProgress(downloadId, 0, 'downloading');
  
  // Process the output to track progress
  childProcess.stdout.on('data', async (data) => {
    const output = data.toString();
    
    // Parse progress information
    if (output.includes('%')) {
      const percentMatch = output.match(/(\d+\.\d+)%/);
      if (percentMatch && percentMatch[1]) {
        const percent = parseFloat(percentMatch[1]);
        global.downloadProgress[downloadId].progress = percent;
        await updateDownloadProgress(downloadId, percent, 'downloading');
      }
    }
  });
  
  childProcess.stderr.on('data', (data) => {
    console.error(`yt-dlp error: ${data}`);
  });
  
  // Set up completion handler
  childProcess.on('close', async (code) => {
    if (code === 0) {
      // Download completed successfully
      global.downloadProgress[downloadId].status = 'processing';
      await updateDownloadProgress(downloadId, global.downloadProgress[downloadId].progress, 'processing');
      
      // If format is not mp4, we need to convert using ffmpeg
      if (format !== 'mp4') {
        const tempPath = outputPath;
        const finalPath = path.join(downloadsDir, `${downloadId}_final.${format}`);
        
        const ffmpeg = spawn('ffmpeg', [
          '-i', tempPath,
          '-c:v', 'copy',
          '-c:a', 'copy',
          finalPath
        ], {
          detached: true,
          stdio: ['ignore', 'pipe', 'pipe']
        });
        
        ffmpeg.on('close', async (ffmpegCode) => {
          if (ffmpegCode === 0) {
            // Conversion completed successfully
            try {
              fs.unlinkSync(tempPath); // Remove temporary file
            } catch (err) {
              console.error('Failed to remove temp file:', err);
            }
            
            // Update download info in database
            const downloads = await getDownloadCollection();
            await downloads.updateOne(
              { downloadId },
              { 
                $set: { 
                  filePath: finalPath,
                  status: 'completed',
                  progress: 100,
                  lastUpdated: new Date()
                }
              }
            );
            
            global.downloadProgress[downloadId].status = 'completed';
            global.downloadProgress[downloadId].progress = 100;
            global.downloadProgress[downloadId].filePath = finalPath;
          } else {
            global.downloadProgress[downloadId].status = 'failed';
            await updateDownloadProgress(downloadId, global.downloadProgress[downloadId].progress, 'failed');
            console.error('FFmpeg conversion failed with code:', ffmpegCode);
          }
        });
        
        // Detach the process to keep it running after request ends
        ffmpeg.unref();
      } else {
        // Update download info in database
        const downloads = await getDownloadCollection();
        await downloads.updateOne(
          { downloadId },
          { 
            $set: { 
              filePath: outputPath,
              status: 'completed',
              progress: 100,
              lastUpdated: new Date() 
            }
          }
        );
        
        global.downloadProgress[downloadId].status = 'completed';
        global.downloadProgress[downloadId].progress = 100;
        global.downloadProgress[downloadId].filePath = outputPath;
      }
    } else {
      global.downloadProgress[downloadId].status = 'failed';
      await updateDownloadProgress(downloadId, global.downloadProgress[downloadId].progress, 'failed');
      console.error('yt-dlp exited with code:', code);
    }
  });
  
  // Detach the process to keep it running after request ends
  childProcess.unref();
  
  return {
    downloadId,
    format,
    status: 'started'
  };
}