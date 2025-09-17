import { Queue }from "bullmq";
import connection from "../connection.js";

//111/////////////////////////////// --- QUEUES
export const queues = {
  getTenMemesQueue: new Queue("get-ten-memes", { connection }),
  postCloudinaryQueue: new Queue("post-cloudinary", { connection }),
};