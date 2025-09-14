import { queues } from '../queues/queues.js';
import { postCloudinary } from '../utils/cloudinaryAPI.js';
import { getTenMemes } from '../utils/memeAPI.js';


queues.getTenMemesQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed. Result:`, result);
});
queues.getTenMemesQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
queues.getTenMemesQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} stalled!`);
});

queues.getTenMemesQueue.process(async (job) => {
  console.log("Starting job");
  try {
    const result = await getTenMemes();
    const data = result
    console.log(data)
    if ((data.status === "success") && (data.memes.length === 10)) {
      const result2 = await postCloudinary();
      const data2 = result2;
      console.log(data2)
      queues.getTenMemesQueue.on('completed', (job, result) => {
      console.log(`Job ${job.id} completed. result ${result.status}, result2 ${result2.status}` );
    });
      return data2;
    } else {
      throw new Error("Invalid meme data: status not success or memes.length != 10");
    }

  } catch (e) {
    console.error("Job failed with error:", e);
    throw (e)
  }
});
