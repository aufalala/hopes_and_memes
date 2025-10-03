import { getAuth, clerkClient} from "@clerk/express";
import { AIRTABLE_T_ALL_USERS } from "../config.js";
import { getRecordsFromAirtable, postUser } from "../services/airtableAPI.js";
import { setRedisCache } from "../services/redisAPI.js";

import getTimestamp from "../utils/utTimestamp.js";

export async function contGetMeUserData({sourceData, req, res}) {
  console.log(`[${getTimestamp()}] TRYING: contGetMeUserData from ${sourceData}`);
  const {userId} = getAuth(req);
  const {createdAt, username, imageUrl} = (await clerkClient.users.getUser(userId));

  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const result = await getRecordsFromAirtable({sourceData, table: AIRTABLE_T_ALL_USERS, filterParams: {clerk_user_id: userId}});
  if (result.status === "success" && result.records.length > 0) {
    return (result);

  } else if (result.status === "success" && result.records.length === 0) {


      const userData = {clerk_user_id: userId, username: username, created_at: String(createdAt), num_memes_rated: "0", points: "0", image_url: imageUrl}
      try {
        await setRedisCache(`users:${userId}`, userData)
      } catch (e) {
          console.error("Error posting user:", e.message);
          return res.status(500).json({ error: "Failed to post user" });
      }

      try {   
        const result2 = await postUser(sourceData, userId, username, createdAt, imageUrl)
        if (result2.status === "success") {
          return (result2);
        }
    
      } catch (e) {
          console.error("Error posting user:", e.message);
          return res.status(500).json({ error: "Failed to post user" });
      }

        
  } else {
    res.status(500).json(result);
  }
}