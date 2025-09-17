import { Worker } from "bullmq";
import { getTenMemes } from "../../utils/memeAPI.js";
import { uploadMemesToCloudinary } from "../../utils/cloudinaryAPI.js";
import connection from "../connection.js";

//111/////////////////////////////// --- WORKERS WORK
const getTenMemesWorker = new Worker(
  "get-ten-memes",
  async (job) => {
    console.log("Starting job", job.name, job.id);
    const { sourceData } = job.data;

    let getTenMemesResult;

    try {
      const result = await getTenMemes(sourceData);
      if (result.status !== "success") {
        throw new Error("getTenMemes failed: status not success");
      }
      getTenMemesResult = result
    } catch (e) {
      console.error("getTenMemes or postCloudinary failed:", e);
      throw e;
    }

    /////////////////////////////////////// INSERT UPLOAD TO AIRTABLE AND CACHE HERE


    try {
      const result = await uploadMemesToCloudinary(sourceData, getTenMemesResult.memes);
      if (result.status !== "success") {
        throw new Error("postCloudinary failed: status not success");
      }
      return result;

    } catch (e) {
      console.error("uploadMemesToCloudinary error:", e);
      throw e;
    }
      

    
  },
  { connection }
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
};

//222// --- WORKER FOR EACH
Object.entries(workers).forEach(([name, worker]) => {
  ["completed", "failed", "stalled", "active", "waiting"].forEach((event) => {
    worker.on(event, (...args) => handleWorkerEvent(name, event, ...args));
  });
});