import { getAuth } from "@clerk/express";
import redisConnection from "../redis/connection.js";

import { AIRTABLE_T_ALL_USERS, AIRTABLE_T_MEME_RATINGS } from "../config.js";
import { getRecordsFromAirtable, postToAirtable, updateAirtableRecord } from "../services/airtableAPI.js";
import { updateCacheHash } from "../services/redisAPI.js";

import getTimestamp from "../utils/utTimestamp.js";

export async function orcRateRatedMeme({sourceData, postParams = {}, req}) {
  console.log(`[${getTimestamp()}] TRYING: orcRateRatedMeme from ${sourceData}`);

  const { userId } = getAuth(req);

  //222// BUILD PARAM IF ORC CALLED DIRECTLY FROM ROUTE  
  postParams.clerk_user_id ??= userId;
  postParams.postLink ??= req.body.postLink;
  postParams.rating ??= req.body.rating;
  postParams.created_at ??= String(Date.now());

  let ratings;
  let flagRatingsExist = false;
  let flagUserRatingExist = false;

  //222// GET MEME RATING RECORDS FROM AIRTABLE
  try {
    ratings = await getRecordsFromAirtable({sourceData, table: AIRTABLE_T_MEME_RATINGS, filterParams: {postLink: postParams.postLink}});
    if (ratings.status === "success" && ratings.records.length > 0) {
      flagRatingsExist = true;
    }
  } catch (e) {
    console.error("orcRateUnratedMeme: getRecordsFromAirtable FAILED:", e);
    throw e;
  }

  //222// CHECK IF USER PREVIOUSLY RATED MEME
  if (flagRatingsExist) {
    flagUserRatingExist = ratings.records.some(
      (record) => record.clerk_user_id === postParams.clerk_user_id
    );
  }

  //222// UPDATE MEME RATING IF ALREADY RATED
  if (flagRatingsExist && flagUserRatingExist) {
    //DO PATCH RATINGS RECORDS
  }

  //222// POST RATING TO AIRTABLE, ADD RATING TO CACHE, ADD POINTS TO USER AT, ADD POINTS TO CACHE
  if (flagRatingsExist && !flagUserRatingExist) {

    
    // POST/ADD RATING HERE
    //
    // 00000000000000000000000000000000 CAN BE ORC 
    //
    
    //222// POST RATING TO AIRTABLE 
    try {
      const result = await postToAirtable({sourceData, table: AIRTABLE_T_MEME_RATINGS, postParams}); 
        // if (result.status === "success") {
        // }
        
      console.log("Rating added to airtable successfully");

    } catch (e) {
      console.error("orcRateRatedMeme: postToAirtable FAILED:", e);
      throw e;
    }

    //222// ADD RATING TO CACHE
    try {
      const result = await updateCacheHash({
        keyPrefix: "userRating",
        record: postParams,
        groupKeyField: "clerk_user_id",
        identifierField: "postLink",
      });
      console.log("Rating added to cache successfully");

    } catch (e) {
      console.error("orcRateRatedMeme: updateCacheHash FAILED:", e);
      throw e;
    }



    //ADD POINTS HERE
    //
    // 00000000000000000000000000000000 CAN BE ORC 
    //

    const pointsToAdd = 2;
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
      }
    } catch (e) {
      console.error("orcRateRatedMeme: getRecordsFromAirtable FAILED:", e);
      throw e;
    }

    userPoints = (Number(userPoints) || 0) + pointsToAdd;

    //222// UPDATE USER POINTS IN AIRTABLE
    try {
      await updateAirtableRecord({
        table: AIRTABLE_T_ALL_USERS,
        recordId: userRecordId,
        fields: { points: String(userPoints) }
      });
      
      console.log("User points updated to airtable successfully");
    } catch (e) {
      console.error("orcRateRatedMeme: updateAirtableRecord FAILED:", e);
      throw e;
    }

    //222// ADD POINTS TO CACHE
    try {
      const cacheUserData = await redisConnection.get(userKey);
      if (!cacheUserData) throw new Error("User not found in Redis");

      const userData = JSON.parse(cacheUserData);
      userData.points = userPoints;

      await redisConnection.set(userKey, JSON.stringify(userData));

      console.log("User points updated to cache successfully:", userData.points);
      return {status: "success"}
      
    } catch (e) {
      console.error("orcRateRatedMeme: addPointsToCache FAILED:", e);
      throw e;
    }

  }
}