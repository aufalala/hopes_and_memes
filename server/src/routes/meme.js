import express from "express";
import { getRandomMeme } from "../utils/memeAPI.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await getRandomMeme();
  if (result.status === "success") {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});


export default router;