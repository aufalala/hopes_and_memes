import express from "express";

import { getUnratedMemesFromCache } from "../services/redisAPI.js";

const router = express.Router();

router.get("/unrated-memes", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${new Date().toISOString()}] CLIENT REACHED: ${sourceData}`);
  try {
    const result = await getUnratedMemesFromCache(sourceData);
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

export default router;