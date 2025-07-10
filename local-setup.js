#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏠 Local Development Setup\n');

// Check if Docker is available
try {
  execSync('docker --version', { stdio: 'ignore' });
  console.log('✅ Docker is available');
  
  // Create docker-compose file for local development
  const dockerComposeContent = `version: "3.8"

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: youtube-downloader
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  mongodb_data:
`;

  const dockerComposePath = path.join(__dirname, 'docker-compose.local.yml');
  fs.writeFileSync(dockerComposePath, dockerComposeContent);
  console.log('✅ Created docker-compose.local.yml for local development');
  
  console.log('\n🚀 To start local services:');
  console.log('   docker-compose -f docker-compose.local.yml up -d');
  console.log('\n🛑 To stop local services:');
  console.log('   docker-compose -f docker-compose.local.yml down');
  
} catch (error) {
  console.log('❌ Docker not available');
  console.log('\n📋 Manual setup required:');
  console.log('1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/');
  console.log('2. Install Redis locally: https://redis.io/download');
  console.log('3. Start MongoDB: mongod');
  console.log('4. Start Redis: redis-server');
}

console.log('\n📝 Update your .env file with:');
console.log('MONGODB_URI=mongodb://localhost:27017/youtube-downloader');
console.log('REDIS_URL=redis://localhost:6379'); 