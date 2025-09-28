import redisConnection from "../redis/connection.js";
import { AIRTABLE_T_ALL_USERS } from "../config.js";
import { getRecordsFromAirtable, updateAirtableRecord } from "../services/airtableAPI.js";

import getTimestamp from "../utils/utTimestamp.js";

export async function orcAddPoints({sourceData, postParams, pointsToAdd}) {
  const userKey = `users:${postParams.clerk_user_id}`
  let userRecordId;
  let userPoints;

  
  //222// GET USER RECORD ID AND POINTS FROM AIRTABLE
  try {
    const result = await getRecordsFromAirtable({
      sourceData,
      table: AIRTABLE_T_ALL_USERS,
      filterParams: {clerk_user_id: postParams.clerk_user_id},
      fullData: true,
    })
    if (result.status === "success") {
      userRecordId = result.records[0].id;
      userPoints = result.records[0].fields.points;
      console.log(`[${getTimestamp()}] orcAddPoints: getRecordsFromAirtable: SUCCESS, user points and meme record id fetched from airtable`);
    }

  } catch (e) {
    console.error("orcAddPoints: getRecordsFromAirtable FAILED:", e);
    throw e;
  }

  userPoints = (Number(userPoints) || 0) + pointsToAdd;

  //222// UPDATE USER POINTS IN AIRTABLE
  try {
    await updateAirtableRecord({
      sourceData,
      table: AIRTABLE_T_ALL_USERS,
      recordId: userRecordId,
      fields: { points: String(userPoints) }
    });
    if (result.status === "success") {
      console.log(`[${getTimestamp()}] orcAddPoints: updateAirtableRecord: SUCCESS, airtable user points updated`);
    }

  } catch (e) {
    console.error("orcAddPoints: updateAirtableRecord FAILED:", e);
    throw e;
  }

  //222// ADD POINTS TO CACHE
  try {
    const cacheUserData = await redisConnection.get(userKey);
    if (!cacheUserData) throw new Error("User not found in Redis");

    const userData = JSON.parse(cacheUserData);
    userData.points = userPoints;

    await redisConnection.set(userKey, JSON.stringify(userData));
    console.log(`[${getTimestamp()}] orcAddPoints: addPoints to cache: SUCCESS, cache user points updated`);
    
  } catch (e) {
    console.error("orcAddPoints: addPointsToCache FAILED:", e);
    throw e;
  }

  return {status: "success"};
}