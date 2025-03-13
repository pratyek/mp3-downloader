// lib/queue.js
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

//console.log(process.env.REDIS_URL);
const connection = new IORedis('rediss://default:Aex7AAIjcDFhZDlhNzdhOWJiODM0MWE5OGY4MDBiMDFmMDg3OWM2NHAxMA@musical-ghost-60539.upstash.io:6379' || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  ts:{}
});
export const downloadQueue = new Queue('downloadQueue', { connection });
