import IORedis from 'ioredis';
import { config } from '../config.js';

const connection = new IORedis(config.redis.url, config.redis.options);

export { connection }; 