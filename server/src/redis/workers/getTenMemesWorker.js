import { Worker } from "bullmq";

import { getTenMemes } from "../../services/memeAPI.js";
import { uploadMemesToCloudinary } from "../../services/cloudinaryAPI.js";
import { uploadUnratedMemesToCache } from "../../services/redisAPI.js";
import { uploadUnratedMemesToAirtable } from "../../services/airtableAPI.js";
import { workerEventListeners } from "./workerEventListener.js";

export function startGetTenMemesWorker(redisConnection) {
  //111/////////////////////////////// --- WORKERS WORK
  const getTenMemesWorker = new Worker(
    "get-ten-memes",
    async (job) => {
      console.log(`[${new Date().toISOString()}] Starting job, ${job.name}, ${job.id}`);
      const { sourceData } = job.data;

      let tenMemes;

      //222// RETRIEVE 10 NEW MEMES FOR "UNRATED"
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

      //222// UPLOAD MEME DATA TO CACHE AND AIRTABLE
      try {
        await Promise.all([
          (async () => {
            //222// UPLOAD MEME DATA TO CACHE
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
            //222// UPLOAD MEME DATA TO AIRTABLE
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
      
      //222// UPLOAD IMAGE TO CLOUDINARY
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
      
    },
    { connection: redisConnection }
  );

  //222// WORKER EVENT LISTENER
  workerEventListeners("getTenMemesWorker", getTenMemesWorker);
  console.log("getTenMemesWorker started");
}