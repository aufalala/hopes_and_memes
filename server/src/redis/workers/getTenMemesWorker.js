import { Worker } from "bullmq";
import redisConnection from "../connection.js";

import { getTenMemes } from "../../utils/memeAPI.js";
import { uploadMemesToCloudinary } from "../../utils/cloudinaryAPI.js";
import { uploadUnratedMemesToCache } from "../../utils/redisAPI.js";
import { uploadUnratedMemesToAirtable } from "../../utils/airtableAPI.js";

//111/////////////////////////////// --- WORKERS WORK
const getTenMemesWorker = new Worker(
  "get-ten-memes",
  async (job) => {
    console.log(`[${new Date().toISOString()}] Starting job, ${job.name}, ${job.id}`);
    const { sourceData } = job.data;

    let tenMemes;

    //222// RETRIEVE 10 MEMES
    try {
      const result = await getTenMemes(sourceData);
      if (result.status !== "success") {
        throw new Error("getTenMemes failed: status not success");
      }
      tenMemes = result.memes
    } catch (e) {
      console.error("getTenMemes:", e);
      throw e;
    }

    let flagCacheAndAirtableSuccess = false;

    try {
      await Promise.all([
        (async () => {
          //222// UPLOAD TO CACHE
          try {
            const result = await uploadUnratedMemesToCache(sourceData, tenMemes);
            if (result.status !== "success") {
              throw new Error("uploadUnratedMemesToCache FAILED: status not success");
            }
          } catch (e) {
            console.error("uploadUnratedMemesToCache FAILED:", e);
            throw "uploadUnratedMemesToCache FAILED";
          }
        })(),
        (async () => {
          //222// UPLOAD TO AIRTABLE
          try {
            const result = await uploadUnratedMemesToAirtable(sourceData, tenMemes);
            if (result.status !== "success") {
              throw new Error("uploadUnratedMemesToAirtable FAILED: status not success");
            }
          } catch (e) {
            console.error("uploadUnratedMemesToAirtable FAILED:", e);
            throw "uploadUnratedMemesToAirtable FAILED";
          }
        })(),
      ]);
      flagCacheAndAirtableSuccess = true;
    } catch (e) {
      console.error(e);
    }
        
    if (!flagCacheAndAirtableSuccess) {
      const cacheOrAirtableFailed = "Cache or Airtable upload failed, terminating job.";
      console.error(cacheOrAirtableFailed);
      throw new Error(cacheOrAirtableFailed);
    } 
    {
      //222// CLOUDINARY
      try {
        const result = await uploadMemesToCloudinary(sourceData, tenMemes);
        if (result.status !== "success") {
          throw new Error("postCloudinary failed: status not success");
        }
        return result;

      } catch (e) {
        console.error("uploadMemesToCloudinary error:", e);
        throw e;
      }
    }
      

    
  },
  { connection: redisConnection }
);

//111/////////////////////////////// --- WORKERS EVENT LISTENERS
//222// --- HANDLER
const handleWorkerEvent = (workerName, event, ...args) => {
  switch (event) {
    case "completed":
      const [job, result] = args;
      console.log(`[${workerName}] Job ${job.id} completed. Result:`, result);
      break;

    case "failed":
      const [jobFailed, err] = args;
      console.error(`[${workerName}] Job ${jobFailed.id} failed:`, err);
      break;

    case "stalled":
      const [jobStalled] = args;
      console.warn(`[${workerName}] Job ${jobStalled.id} stalled!`);
      break;

    case "active": {
      const [jobActive] = args;
      console.log(`[${workerName}] Job ${jobActive.id} started.`);
      break;
    }

    case "waiting": {
      const [jobId] = args;
      console.log(`[${workerName}] Job ${jobId} is waiting in queue.`);
      break;
    }      

    default:
      console.warn(`[${workerName}] Unhandled worker event: ${event}`);
  }
};

//222// --- WORKER LIST
const workers = {
  getTenMemesWorker,
  // replenishUnratedMemesCount,
};

//222// --- WORKER FOR EACH
Object.entries(workers).forEach(([name, worker]) => {
  ["completed", "failed", "stalled", "active", "waiting"].forEach((event) => {
    worker.on(event, (...args) => handleWorkerEvent(name, event, ...args));
  });
});