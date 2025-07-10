import { NextResponse } from 'next/server';
import fs from 'fs';
import { getDownloadCollection } from '../../../../lib/database.js';

export async function POST(req) {
  try {
    const { downloadId } = await req.json();
    if (!downloadId) {
      return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
    }
    const downloads = await getDownloadCollection();
    const download = await downloads.findOne({ downloadId });
    if (!download) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 });
    }
    // Delete file if it exists
    if (download.filePath && fs.existsSync(download.filePath)) {
      fs.unlinkSync(download.filePath);
    }
    // Remove DB record
    await downloads.deleteOne({ downloadId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: 'Download not found' }, { status: 404 });
    }
    if (download.filePath && fs.existsSync(download.filePath)) {
      fs.unlinkSync(download.filePath);
    }
    await downloads.deleteOne({ downloadId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 