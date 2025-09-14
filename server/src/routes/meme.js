import express from "express";
import { requireAuth } from "@clerk/express";

import { getRandomMeme, getTenMemes} from "../utils/memeAPI.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await getRandomMeme();
    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    console.error(`Failed to get meme`)
  }
});


router.get("/ten-memes", requireAuth(), async (req, res) => {
  try {
    const result = await getTenMemes();
    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    console.error(`Failed to get memes`)
  }
});


export default router;