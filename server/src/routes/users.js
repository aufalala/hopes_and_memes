import express from "express";
import { requireAuth, getAuth, clerkClient} from "@clerk/express";

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
      createdAt: new Date(createdAt),
    });

  } catch (error) {
    console.error("Error fetching user profile from clerk:", error.message);
    res.status(500).json({ error: "Failed to fetch profile from clerk" });
  }
});

export default router;