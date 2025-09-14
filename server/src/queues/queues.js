import Queue from 'bull';


const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const queues = {
  getTenMemesQueue: new Queue("get-ten-memes", redisUrl),
  postCloudinaryQueue: new Queue("post-cloudinary", redisUrl),
};