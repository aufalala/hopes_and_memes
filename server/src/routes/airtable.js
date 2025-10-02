import express from "express";

import { getRatedMemes, getRecordsFromAirtable } from "../services/airtableAPI.js";

import getTimestamp from "../utils/utTimestamp.js";

const router = express.Router();

//222// TO PULL RATED MEMES
router.get("/rated-memes", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);
  
  try {
    const { cursor, subreddits } = req.query;
    const subredditFilter = subreddits ? JSON.parse(subreddits) : [];

    const result = await getRatedMemes({ cursor, subredditFilter });

    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;