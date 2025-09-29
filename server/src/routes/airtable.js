import express from "express";

import { getRatedMemes, getRecordsFromAirtable } from "../services/airtableAPI.js";

import getTimestamp from "../utils/utTimestamp.js";

const router = express.Router();

//222// TO PULL RATED MEMES
router.get("/rated-memes", async (req, res) => {
  try {
    const { cursor } = req.query;
    const result = await getRatedMemes({ cursor }); // pass cursor instead of offset

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