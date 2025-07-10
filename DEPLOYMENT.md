# Deployment Guide: Vercel + Docker Hybrid Setup

This guide explains how to deploy your YouTube downloader with:
- **Frontend + API Routes**: Deployed on Vercel
- **Backend Services**: Deployed with Docker (for system dependencies)

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Docker        │    │   Cloud         │
│                 │    │   Backend       │    │   Services      │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  Frontend   │ │    │ │   Worker    │ │    │ │  MongoDB    │ │
│ │  (React)    │ │    │ │ (yt-dlp)    │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ API Routes  │ │◄──►│ │   Redis     │ │    │ │   Redis     │ │
│ │ (Next.js)   │ │    │ │   (Queue)   │ │    │ │   (Cloud)   │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Step 1: Deploy Frontend + API Routes to Vercel

### 1.1 Prepare for Vercel Deployment

1. **Remove system-dependent files from Vercel build:**
   ```bash
   # These files will be deployed separately
   rm -rf workers/
   rm dockerfile.backend
   rm docker-compose.backend.yml
   ```

2. **Update .gitignore for Vercel:**
   ```bash
   # Add to .gitignore
   downloads/
   .env
   ```

### 1.2 Deploy to Vercel

1. **Connect your GitHub repo to Vercel**
2. **Set environment variables in Vercel dashboard:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   ```

3. **Deploy**
   - Vercel will automatically detect Next.js
   - Build and deploy frontend + API routes

## Step 2: Deploy Backend Services with Docker

### 2.1 Choose Your Docker Host

**Option A: Render (Recommended)**
- Free tier available
- Easy Docker deployment
- Good for small projects

**Option B: Railway**
- Simple deployment
- Good pricing

**Option C: DigitalOcean App Platform**
- More control
- Pay-as-you-go

**Option D: AWS/GCP/Azure**
- Enterprise-grade
- More complex setup

### 2.2 Deploy to Render

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure the service:**
   ```
   Build Command: docker build -f dockerfile.backend .
   Start Command: node workers/downloadWorker.js
   ```

4. **Set environment variables:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   WORKER_PORT=5050
   ```

5. **Deploy**

### 2.3 Deploy to Railway

1. **Connect your GitHub repo to Railway**
2. **Create a new service**
3. **Select "Deploy from Dockerfile"**
4. **Use `dockerfile.backend`**
5. **Set environment variables**
6. **Deploy**

## Step 3: Configure Cross-Origin Communication

### 3.1 Update API Routes for External Backend

Your API routes on Vercel will communicate with:
- **MongoDB**: Direct connection
- **Redis**: Direct connection  
- **Backend Worker**: Via BullMQ queue

### 3.2 Environment Variables

**Vercel Environment Variables:**
```
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
```

**Docker Backend Environment Variables:**
```
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
WORKER_PORT=5050
```

## Step 4: Test the Deployment

### 4.1 Test Frontend
1. Visit your Vercel URL
2. Test the UI functionality

### 4.2 Test Backend
1. Submit a download request
2. Check if the worker processes the job
3. Monitor progress updates

### 4.3 Test File Downloads
1. Complete a download
2. Test file download functionality

## Troubleshooting

### Common Issues

1. **Worker not processing jobs:**
   - Check Redis connection
   - Verify environment variables
   - Check worker logs

2. **File downloads not working:**
   - Verify file paths
   - Check file permissions
   - Ensure downloads directory exists

3. **Progress not updating:**
   - Check Redis connection
   - Verify BullMQ configuration
   - Check API route logs

### Debug Commands

```bash
# Test Redis connection
redis-cli -u your_redis_url ping

# Test MongoDB connection
node test-db.js

# Check worker status
curl http://your-backend-url:5050/
```

## Cost Optimization

### Vercel
- Free tier: 100GB bandwidth/month
- Pro: $20/month for more bandwidth

### Docker Backend
- Render: Free tier available
- Railway: $5/month minimum
- DigitalOcean: $5/month minimum

### Database
- MongoDB Atlas: Free tier available
- Redis Cloud: Free tier available

## Security Considerations

1. **Environment Variables**: Never commit secrets
2. **CORS**: Configure if needed
3. **Rate Limiting**: Implement on API routes
4. **File Access**: Secure file download endpoints

## Monitoring

1. **Vercel Analytics**: Built-in monitoring
2. **Backend Logs**: Check Docker container logs
3. **Database Monitoring**: Use MongoDB Atlas/Redis Cloud dashboards
4. **Queue Monitoring**: Monitor BullMQ queue status 