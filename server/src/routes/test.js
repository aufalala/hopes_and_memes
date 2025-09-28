import express from "express";
import { requireAuth } from "@clerk/express";

import { pingAirtable, getTestImage, getUnratedMemeCount } from "../services/airtableAPI.js";
import { queues } from "../redis/queues/queues.js";

import getTimestamp from "../utils/utTimestamp.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);
  try {
    const result = await pingAirtable(sourceData);

    if (result.status === "success") {
      return res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e.message);
  }
});

router.get("/testImage", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);
  try {
    const result = await getTestImage(sourceData);
    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (e) {
      console.error(e);
      res.status(500).json(e.message);
  }
});

router.get("/testImage/protected", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);
  try {
    const result = await getTestImage(sourceData);
    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (e) {
      console.error(e);
      res.status(500).json(e.message);
  }
});

//222// CURRENTLY USED BY TEST PAGE, TO BE TRIGGERED BY USER RATE ATTEMPT AND SERVER START
router.get("/meme-count", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);
  try {
    const result = await getUnratedMemeCount(sourceData);
    if (result.status !== "success") {
      return res.status(500).json(result);
    }
    console.log(result.status, result.count)
    res.json(result);

    if (result.count <= 5) {
      console.log("trying to get existing job count")
      
      try {
        const existingJobs = await queues.getTenMemesQueue.getWaiting();
        console.log(existingJobs);
        const alreadyQueued = existingJobs.length > 0;

        if (!alreadyQueued) {
          
          try {
            await queues.getTenMemesQueue.add(
            "get-ten-memes-job",
            {sourceData},  
            {   attempts: 5, removeOnComplete: true, removeOnFail: true }
          );
            console.log("getTenMemesQueue job added to queue");
          
          } catch (e) {
            console.error(e);
            return res.status(500).json({ error: e.message });
          }

        } else {
          console.log("getTenMemesQueue job already queued");
        }

      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
      }
    }

  } catch (e) {
    console.error(e);
    if (!res.headersSent) {
      return res.status(500).json({ error: e.message });
    }
  }
});

export default router;
