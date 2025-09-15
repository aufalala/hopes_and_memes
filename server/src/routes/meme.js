import express from "express";
import { requireAuth } from "@clerk/express";

import { getRandomMeme, getTenMemes} from "../utils/memeAPI.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${new Date().toISOString()}] CLIENT REACHED: ${sourceData}`);
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

router.get("/ten-memes", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${new Date().toISOString()}] CLIENT REACHED: ${sourceData}`);
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