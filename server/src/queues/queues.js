import Queue from 'bull';

import { URL } from 'url';

function createRedisOptions() {
  if (process.env.REDIS_URL) {
    try {
      const redisUrl = new URL(process.env.REDIS_URL);
      return {
        host: redisUrl.hostname,
        port: parseInt(redisUrl.port, 10),
        password: redisUrl.password,
        family: 4,
      };
    } catch {
      // Fallback to raw string URL if parsing fails
      return process.env.REDIS_URL;
    }
  }

  return {
    host: '127.0.0.1',
    port: 6379,
    family: 4,
  };
}

const redisConnection = createRedisOptions();

// const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const queues = {
  getTenMemesQueue: new Queue("get-ten-memes", redisConnection),
  postCloudinaryQueue: new Queue("post-cloudinary", redisConnection),
};