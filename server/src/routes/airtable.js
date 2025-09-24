import express from "express";


import getTimestamp from "../utils/utTimestamp.js";
import { getRatedMemes, getRecordsFromAirtable } from "../services/airtableAPI.js";
import { AIRTABLE_T_RATED_MEMES, AIRTABLE_TOKEN, AIRTABLE_URL } from "../config.js";


const router = express.Router();

router.get("/rated-memes", async (req, res) => {
  try {
    const { offset } = req.query;
    const result = await getRatedMemes(offset);

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