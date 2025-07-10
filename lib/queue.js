// lib/queue.js
import { Queue } from 'bullmq';
import { connection } from './redis.js';

export const downloadQueue = new Queue('downloadQueue', { connection });
