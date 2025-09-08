import express from "express";
import { requireAuth } from "@clerk/express";

import { pingAirtable, getTestImage } from "../utils/airtableAPI.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pingAirtable();

    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in / route:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

router.get("/testImage", async (req, res) => {
  try {
    const result = await getTestImage();
    if (result.status === "success") {
      res.json(result);
    } 
  } catch (err) {
      console.error(err);
      res.status(500).json(err.message);
  }
});

router.get("/testImage/protected", requireAuth(), async (req, res) => {
  try {
    const result = await getTestImage();
    if (result.status === "success") {
      res.json(result);
    } 
  } catch (err) {
      console.error(err);
      res.status(500).json(err.message);
  }
});

export default router;
