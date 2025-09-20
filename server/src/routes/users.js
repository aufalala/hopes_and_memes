import express from "express";
import { requireAuth, getAuth, clerkClient} from "@clerk/express";

import { getUserVerify, postUser } from "../services/airtableAPI.js";

const router = express.Router();

router.get("/profile", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${new Date().toISOString()}] CLIENT REACHED: ${sourceData}`);
  try {
    const {userId} = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const {createdAt} = (await clerkClient.users.getUser(userId));

    return res.json({
      status: "success",
      userId: userId,
      createdAt: createdAt,
    });

  } catch (error) {
    console.error("Error fetching user profile from clerk:", error.message);
    return res.status(500).json({ error: "Failed to fetch profile from clerk" });
  }
});

router.get("/verify", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${new Date().toISOString()}] CLIENT REACHED: ${sourceData}`);
  try {
    const {userId} = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const result = await getUserVerify(sourceData, userId);
    if (result.status === "success") {
      return res.json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (err) {
      console.error(err);
      return res.status(500).json(err.message);
  }
});

router.post("/", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${new Date().toISOString()}] CLIENT REACHED: ${sourceData}`);
  try {  
    const {userId} = getAuth(req);
    const {createdAt, username} = (await clerkClient.users.getUser(userId));

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const result = await postUser(sourceData, userId, username, createdAt)
    if (result.status === "success") {
      return res.json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
      console.error("Error posting user:", error.message);
      return res.status(500).json({ error: "Failed to post user" });
    }
});

export default router;