// lib/queue.js
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

//console.log(process.env.REDIS_URL);
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  ts:{}
});
export const downloadQueue = new Queue('downloadQueue', { connection });
