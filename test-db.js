#!/usr/bin/env node

import { getDownloadCollection, closeConnection } from './lib/database.js';
import { connection as redisConnection } from './lib/redis.js';

console.log('🔍 Testing database connections...\n');

// Test MongoDB connection
console.log('📊 Testing MongoDB connection...');
try {
  const collection = await getDownloadCollection();
  const count = await collection.countDocuments();
  console.log('✅ MongoDB connected successfully!');
  console.log(`📈 Documents in collection: ${count}`);
} catch (error) {
  console.error('❌ MongoDB connection failed:', error.message);
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Check if MongoDB is running');
  console.log('2. Verify your MONGODB_URI in .env file');
  console.log('3. If using authentication, make sure MONGODB_USER and MONGODB_PASS are set');
}

// Test Redis connection
console.log('\n🔴 Testing Redis connection...');
try {
  await redisConnection.ping();
  console.log('✅ Redis connected successfully!');
} catch (error) {
  console.error('❌ Redis connection failed:', error.message);
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Check if Redis is running');
  console.log('2. Verify your REDIS_URL in .env file');
}

// Close connections
await closeConnection();
await redisConnection.disconnect();

console.log('\n🏁 Connection test completed!'); 