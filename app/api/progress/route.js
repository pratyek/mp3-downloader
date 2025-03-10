// app/api/progress/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Get progress ID from query string
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Progress ID is required' }, { status: 400 })
    }
    
    // Access the global progress tracking object
    if (!global.downloadProgress) {
      global.downloadProgress = {}
    }
    
    const progress = global.downloadProgress[id]
    
    if (!progress) {
      return NextResponse.json({ success: false, error: 'Progress not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}