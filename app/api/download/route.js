// app/api/download/route.js
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from 'mongodb';
import { downloadQueue } from '../../../lib/queue'; // Ensure this file exports a BullMQ queue instance
import fs from 'fs';
import path from 'path';

// Database connection
const uri = 'mongodb+srv://pratyekpk3:pratyek@cluster0.7hlp9.mongodb.net/mp3-mp4-downloader?retryWrites=true&w=majority' || 'mongodb://localhost:27017/youtube-downloader';
let client = new MongoClient(uri);

// Helper function to get the MongoDB collection
async function getDownloadCollection() {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
    }
    return client.db('youtube-downloader').collection('downloads');
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Exit worker on error
  }
}


// Check if a video already exists (completed) in the database
async function checkVideoExists(url, format) {
  try {
    const downloads = await getDownloadCollection();
    const existingDownload = await downloads.findOne({
      url,
      format,
      status: 'completed'
    });
    if (
      existingDownload &&
      existingDownload.filePath &&
      fs.existsSync(existingDownload.filePath)
    ) {
      return existingDownload;
    }
    return null;
  } catch (error) {
    console.error('Failed to check if video exists:', error);
    return null;
  }
}

// Create a new download record in MongoDB
async function createDownloadRecord(url, format, startTime, endTime, downloadId) {
  try {
    const downloads = await getDownloadCollection();
    const record = {
      url,
      format,
      downloadId,
      progress: 0,
      status: 'starting',
      clipInfo: startTime && endTime ? { startTime, endTime } : null,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    await downloads.insertOne(record);
  } catch (error) {
    console.error('Failed to create download record in DB:', error);
  }
}

// POST handler: create a new download job via BullMQ and record it in MongoDB
export async function POST(req) {
  try {
    const { url, format = 'mp4', startTime, endTime } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    
    // Check if the video already exists (completed)
    const existingVideo = await checkVideoExists(url, format);
    if (existingVideo) {
      return NextResponse.json({
        downloadId: existingVideo.downloadId,
        format: existingVideo.format,
        status: 'completed',
        progress: 100,
        alreadyExists: true
      });
    }
    
    // Check for any in-progress download for the same URL and format
    const downloads = await getDownloadCollection();
    const inProgressDownload = await downloads.findOne({
      url,
      format,
      status: { $in: ['starting', 'downloading', 'processing'] }
    });
    if (inProgressDownload) {
      return NextResponse.json({
        downloadId: inProgressDownload.downloadId,
        format: inProgressDownload.format,
        status: inProgressDownload.status,
        progress: inProgressDownload.progress || 0,
        inProgress: true
      });
    }
    
    // Generate a new download ID and create a new download record
    const downloadId = uuidv4();
    await createDownloadRecord(url, format, startTime, endTime, downloadId);
    
    // Enqueue a new download job using BullMQ
    await downloadQueue.add('downloadJob', { url, format, startTime, endTime, downloadId });
    
    return NextResponse.json({ downloadId, format, status: 'queued' });
  } catch (error) {
    console.error('Download request error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET handler: check download progress by querying MongoDB
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const downloadId = searchParams.get('downloadId');
  
  if (!downloadId) {
    return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
  }
  
  try {
    const downloads = await getDownloadCollection();
    const download = await downloads.findOne({ downloadId });
    
    if (!download) {
      console.error(`Download record not found for ID: ${downloadId}`);
      return NextResponse.json({ error: 'Download not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      downloadId,
      progress: download.progress || 0,
      status: download.status,
      filePath: download.filePath || null,
      error: download.error || null
    });
  } catch (error) {
    console.error('Progress check error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

