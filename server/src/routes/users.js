import express from "express";
import { requireAuth, getAuth, clerkClient} from "@clerk/express";

import { getUserVerify, postUser } from "../utils/airtableAPI.js";

const router = express.Router();

router.get("/profile", requireAuth(), async (req, res) => {
  try {
    const {userId} = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const {createdAt} = (await clerkClient.users.getUser(userId));

    res.json({
      userId: userId,
      createdAt: createdAt,
    });

  } catch (error) {
    console.error("Error fetching user profile from clerk:", error.message);
    res.status(500).json({ error: "Failed to fetch profile from clerk" });
  }
});


router.get("/verify", requireAuth(), async (req, res) => {
  try {
    const {userId} = getAuth(req);

    if (!userId) {
      res.status(401).json({ error: "Not authenticated" });
    }

    const result = await getUserVerify(userId);
    if (result.status === "success") {
      return res.json(result);
    }
  } catch (err) {
      console.error(err);
      return res.status(500).json(err.message);
  }
});

router.post("/", requireAuth(), async (req, res) => {
    const {userId} = getAuth(req);
    const {createdAt, username} = (await clerkClient.users.getUser(userId));

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

      try {    
        const result = await postUser(userId, username, createdAt)
        return res.json(result);

        } catch (error) {
          console.error("Error posting user:", error.message);
          return res.status(500).json({ error: "Failed to post user" });
        }
    
});

export default router;