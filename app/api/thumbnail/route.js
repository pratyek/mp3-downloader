// app/api/thumbnail/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
    } else {
      videoId = urlObj.searchParams.get('v');
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (!videoId) {
    return NextResponse.json({ error: 'Could not extract video ID' }, { status: 400 });
  }

  // Try fetching from maxresdefault, then fallback to hqdefault
  const resolutions = ['maxresdefault', 'hqdefault'];
  let thumbnailBuffer = null;
  for (const res of resolutions) {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${res}.jpg`;
    try {
      const response = await fetch(thumbnailUrl);
      if (response.ok) {
        thumbnailBuffer = await response.arrayBuffer();
        break;
      }
    } catch (error) {
      console.error(`Error fetching ${res} thumbnail:`, error);
    }
  }

  if (!thumbnailBuffer) {
    return NextResponse.json({ error: 'Failed to fetch thumbnail' }, { status: 500 });
  }

  const response = new NextResponse(thumbnailBuffer);
  response.headers.set('Content-Type', 'image/jpeg');
  response.headers.set('Content-Disposition', `attachment; filename="${videoId}.jpg"`);
  return response;
}
