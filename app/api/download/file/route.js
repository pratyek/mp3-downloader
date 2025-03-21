import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

// Database connection
const uri = "mongodb+srv://pratyekpk3:pratyek@cluster0.7hlp9.mongodb.net/mp3-mp4-downloader?retryWrites=true&w=majority" || 'mongodb://localhost:27017/youtube-downloader';
let client = new MongoClient(uri);

// Helper function to get database collection
async function getDownloadCollection() {
  await client.connect();
  const db = client.db('youtube-downloader');
  return db.collection('downloads');
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const downloadId = searchParams.get('downloadId');
  
  if (!downloadId) {
    return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
  }
  
  try {
    // Get download info from database
    const downloads = await getDownloadCollection();
    const download = await downloads.findOne({ downloadId });
    
    if (!download) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 });
    }
    
    if (download.status !== 'completed') {
      return NextResponse.json({ 
        error: 'Download is not complete',
        status: download.status,
        progress: download.progress
      }, { status: 400 });
    }
    
    // Check if file exists
    if (!download.filePath || !fs.existsSync(download.filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Get file information
    const fileStats = fs.statSync(download.filePath);
    const fileName = path.basename(download.filePath);
    
    // Read file content
    const fileBuffer = fs.readFileSync(download.filePath);
    
    // Create response with file
    const response = new NextResponse(fileBuffer);
    
    // Set appropriate headers
    response.headers.set('Content-Type', 'application/octet-stream');
    response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    response.headers.set('Content-Length', fileStats.size);
    
    return response;
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}