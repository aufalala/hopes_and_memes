import express from "express";
import { requireAuth, getAuth } from "@clerk/express";

import { contRatingUnratedMemes } from "../controllers/contRatingUnratedMeme.js";
import { orcRateRatedMeme } from "../orchestrators/orcRateRatedMeme.js";
import { getUnratedMemesFromCache } from "../services/redisAPI.js";

import getTimestamp from "../utils/utTimestamp.js";

const router = express.Router();

router.get("/unrated-memes", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);
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

router.post("/unrated-meme-rating", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);

  const {userId} = getAuth(req);
  if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

  try {
    const result = await contRatingUnratedMemes(sourceData, req)

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

router.post("/rated-meme-rating", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);

  const {userId} = getAuth(req);
  if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

  try {
    const result = await orcRateRatedMeme({sourceData, req})
    console.log("sadsadas")

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

export default router;
