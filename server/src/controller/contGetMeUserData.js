import { getAuth } from "@clerk/express";
import { AIRTABLE_T_ALL_USERS } from "../config.js";
import { getRecordsFromAirtable } from "../services/airtableAPI.js";

export async function contGetMeUserData({sourceData, req, res}) {
  console.log(`[${new Date().toISOString()}] TRYING: contRateUnratedMemes from ${sourceData}`);
  const {userId} = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const result = await getRecordsFromAirtable({sourceData, table: AIRTABLE_T_ALL_USERS, filterParams: {clerk_user_id: userId}});
  if (result.status === "success") {
    return (result);
  } else {
    res.status(500).json(result);
  }
}