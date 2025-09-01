import express from "express";
import { pingAirtable } from "../utils/airtable.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pingAirtable();
  if (result.status === "success") {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

export default router;
