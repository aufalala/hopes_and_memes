import express from "express";
import { getRandomMeme } from "../utils/memeAPI.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await getRandomMeme();
    if (result.status === "success") {
      res.json(result);
    }
  } catch (err) {

    console.error(`Failed to get meme`)
  }
});


export default router;