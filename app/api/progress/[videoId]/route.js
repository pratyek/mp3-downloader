// app/api/progress/route.js
import { NextResponse } from 'next/server'

// Reference to the jobs object from download API
const jobs = global.jobs || {}

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const jobId = url.searchParams.get('jobId')
    
    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 })
    }
    
    const job = jobs[jobId]
    
    if (!job) {
      return NextResponse.json({ 
        success: false, 
        error: 'Job not found' 
      }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, progress: job })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch progress' }, { status: 500 })
  }
}