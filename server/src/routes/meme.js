import express from "express";
import { requireAuth } from "@clerk/express";

import { getRandomMeme, getTenMemes} from "../services/memeAPI.js";

import getTimestamp from "../utils/utTimestamp.js";

const router = express.Router();

//222// FOR TEST, TO PULL 1 MEME
router.get("/", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);
  try {
    const result = await getRandomMeme(sourceData);
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

//CURRENTLY UNUSED
router.get("/ten-memes", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);
  try {
    const result = await getTenMemes(sourceData);
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