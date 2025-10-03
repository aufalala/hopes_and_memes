import express from "express";
import { requireAuth, getAuth, clerkClient} from "@clerk/express";

import { contGetMeUserData } from "../controllers/contGetMeUserData.js";
import { getHashRecordsFromCache, getRecordsFromCache } from "../services/redisAPI.js";

import getTimestamp from "../utils/utTimestamp.js";

const router = express.Router();

router.get("/profile", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);
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

//222// USED BY CLIENT TO PULL USERDATA / POST USERDATA TO AIRTABLE
router.get("/me", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);
  try {
    const result = await contGetMeUserData({sourceData, req})
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

//222// USED BY CLIENT FOR USER MEME RATING CACHE FOR MEME UI RATED
router.get("/me/ratings", requireAuth(), async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);

  
  const {userId} = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const keyPrefix = "userRating";
  const keyParam = userId;

  try {
    const result = await getHashRecordsFromCache({sourceData, keyPrefix, keyParam})
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

//222// GET ALL USER RECORDS FROM CACHE
router.get("/all", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);

  const keyPrefix = "users";
  const keyParam = "*";

  try {
    const result = await getRecordsFromCache({sourceData, keyPrefix, keyParam})
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


router.get("/profile/:userId", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${getTimestamp()}] CLIENT REACHED: ${sourceData}`);

  const userId = req.params.userId;
  const keyPrefix = "users";
  const keyParam = userId;

  try {
    const result = await getRecordsFromCache({sourceData, keyPrefix, keyParam})
    if (result.status === "success") {
      return res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
      console.error(err);
      return res.status(500).json(err.message);
  }

})
export default router;