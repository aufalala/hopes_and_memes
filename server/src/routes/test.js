import express from "express";
import { pingAirtable, getTestImage } from "../utils/airtableAPI.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pingAirtable();
  if (result.status === "success") {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

router.get("/testImage", async (req, res) => {
  const result = await getTestImage();
  if (result.status === "success") {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

export default router;
