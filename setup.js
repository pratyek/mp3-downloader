#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 YouTube Downloader Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Database Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/youtube-downloader

# For MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

MONGODB_DB=youtube-downloader

# Redis Configuration
# For local Redis:
REDIS_URL=redis://localhost:6379

# For Redis Cloud (replace with your connection string):
# REDIS_URL=rediss://username:password@host:port

# Application Configuration
PORT=3000
WORKER_PORT=5050
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Edit the .env file with your database credentials');
console.log('2. Make sure MongoDB and Redis are running');
console.log('3. Run: npm run test-db (to test connections)');
console.log('4. Run: npm run dev (for main app)');
console.log('5. Run: npm run worker (for background processing)');
console.log('\n💡 Connection string examples:');
console.log('   Local MongoDB: mongodb://localhost:27017/youtube-downloader');
console.log('   MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
console.log('   Local Redis: redis://localhost:6379');
console.log('   Redis Cloud: rediss://username:password@host:port'); 