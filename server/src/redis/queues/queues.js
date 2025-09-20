import { Queue }from "bullmq";
import redisConnection from "../connection.js";

//111/////////////////////////////// --- QUEUES
export const queues = {
  getTenMemesQueue: new Queue("get-ten-memes", { redisConnection }),
  // replenishUnratedMemesCount: new Queue("replenish-unrated-memes-count", { redisConnection }),
  // postCloudinaryQueue: new Queue("post-cloudinary", { redisConnection }),
};