# Troubleshooting Guide

## MongoDB Connection Issues

### Error: `querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net`

This error occurs when trying to connect to MongoDB Atlas but the DNS lookup fails.

**Solutions:**

1. **Check your connection string format:**
   ```
   ✅ Correct: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ❌ Wrong: mongodb://username:password@cluster.mongodb.net/database
   ```

2. **Verify your cluster name:**
   - Log into MongoDB Atlas
   - Check the exact cluster name in your connection string
   - Make sure the cluster is active and accessible

3. **Check network connectivity:**
   - Ensure you have internet access
   - Try pinging the cluster domain: `ping cluster.mongodb.net`

4. **Use local MongoDB instead:**
   ```bash
   # Run the local setup
   npm run local-setup
   
   # Start local services with Docker
   docker-compose -f docker-compose.local.yml up -d
   
   # Update .env file
   MONGODB_URI=mongodb://localhost:27017/youtube-downloader
   ```

### Error: `Command find requires authentication`

This error occurs when MongoDB requires authentication but credentials aren't provided.

**Solutions:**

1. **For local MongoDB without auth:**
   ```
   MONGODB_URI=mongodb://localhost:27017/youtube-downloader
   ```

2. **For MongoDB Atlas:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

3. **For local MongoDB with auth:**
   ```
   MONGODB_URI=mongodb://username:password@localhost:27017/youtube-downloader
   ```

## Redis Connection Issues

### Error: `ECONNREFUSED`

This error occurs when Redis server is not running.

**Solutions:**

1. **Start local Redis:**
   ```bash
   # With Docker
   docker run -d -p 6379:6379 redis:alpine
   
   # Or locally
   redis-server
   ```

2. **Check Redis connection:**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

## Quick Setup Commands

```bash
# 1. Setup environment
npm run setup

# 2. Setup local services (if using Docker)
npm run local-setup
docker-compose -f docker-compose.local.yml up -d

# 3. Test connections
npm run test-db

# 4. Start the application
npm run dev

# 5. Start the worker (in another terminal)
npm run worker
```

## Environment Variables Reference

```env
# Database
MONGODB_URI=mongodb://localhost:27017/youtube-downloader
MONGODB_DB=youtube-downloader

# Redis
REDIS_URL=redis://localhost:6379

# Application
PORT=3000
WORKER_PORT=5050
```

## Common Issues

1. **Port already in use:**
   - Change PORT in .env file
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`

2. **yt-dlp not found:**
   ```bash
   pip install --user yt-dlp
   ```

3. **Permission denied:**
   - Check file permissions
   - Run with appropriate user privileges 