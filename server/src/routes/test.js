import express from "express";
import { requireAuth } from "@clerk/express";

import { pingAirtable, getTestImage, getUnratedMemeCount } from "../utils/airtableAPI.js";
import { queues } from "../queues/queues.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pingAirtable();

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
  try {
    const result = await getTestImage();
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
  try {
    const result = await getTestImage();
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


router.get("/meme-count", async (req, res) => {
  try {
    const result = await getUnratedMemeCount();
    if (result.status !== "success") {
      return res.status(500).json(result);
    }
    
    if (result.count <= 5) {
      const existingJobs = await queues.getTenMemesQueue.getWaiting();
      console.log(existingJobs);
      const alreadyQueued = existingJobs.length > 0;

      if (!alreadyQueued) {
        await queues.getTenMemesQueue.add({}, { removeOnComplete: true, removeOnFail: true });
        console.log('getTenMemesQueue job added to queue');
      } else {
        console.log('getTenMemesQueue job already queued');
      }
    }

    res.json(result);

  } catch (e) {
    console.error(e);
    if (!res.headersSent) {
      return res.status(500).json({ error: e.message });
    }
  }
});










export default router;
