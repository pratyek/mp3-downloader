// Configuration file for the YouTube Downloader application
export const config = {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-downloader',
    dbName: process.env.MONGODB_DB || 'youtube-downloader',
    collection: 'downloads',
    options: {
      // Add authentication if credentials are provided
      ...(process.env.MONGODB_USER && process.env.MONGODB_PASS && {
        auth: {
          username: process.env.MONGODB_USER,
          password: process.env.MONGODB_PASS
        }
      }),
      // Add retry options for better connection handling
      retryWrites: true,
      w: 'majority',
      // Add timeout options
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    }
  },
  
  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    options: {
      maxRetriesPerRequest: null,
      ts: {}
    }
  },
  
  // Application
  app: {
    port: process.env.PORT || 3000,
    workerPort: process.env.WORKER_PORT || 5050
  },
  
  // Downloads
  downloads: {
    directory: './downloads'
  }
}; 