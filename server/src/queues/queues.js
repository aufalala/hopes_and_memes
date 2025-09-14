import pkg from 'bullmq';
const { Queue } = pkg;
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const connection = new IORedis(redisUrl, {
  enableReadyCheck: false,
});

export const queues = {
  getTenMemesQueue: new Queue('get-ten-memes', { connection }),
  postCloudinaryQueue: new Queue('post-cloudinary', { connection }),
};

connection.on('connect', () => console.log('Redis connecting...'));
connection.on('ready', () => console.log('Redis ready!'));
connection.on('error', (err) => console.error('Redis error:', err.message));
connection.on('close', () => console.log('Redis connection closed'));