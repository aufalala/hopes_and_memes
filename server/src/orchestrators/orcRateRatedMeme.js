import { getAuth } from "@clerk/express";

import { AIRTABLE_T_MEME_RATINGS } from "../config.js";
import { getRecordsFromAirtable, postToAirtable, updateAirtableRecord } from "../services/airtableAPI.js";
import { getHashValuesFromCache, updateCacheHash } from "../services/redisAPI.js";

import getTimestamp from "../utils/utTimestamp.js";
import { orcAddPoints } from "./orcAddPoints.js";

export async function orcRateRatedMeme({sourceData, postParams = {}, req}) {
  console.log(`[${getTimestamp()}] TRYING: orcRateRatedMeme from ${sourceData}`);

  const { userId } = getAuth(req);

  //222// BUILD PARAM IF ORC CALLED DIRECTLY FROM ROUTE  
  postParams.clerk_user_id ??= userId;
  postParams.postLink ??= req.body.postLink;
  postParams.rating ??= req.body.rating;
  postParams.created_at ??= String(Date.now());

  let ratings;
  let userRatingId;
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

  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  //222// IF ALREADY RATED BY USER, UPDATE MEME RATING IN AIRTABLE AND CACHE 
  if (flagRatingsExist && flagUserRatingExist) {

    //222// GET USER RATING IN AIRTABLE
    try {
      const result = await getRecordsFromAirtable({
        sourceData,
        table: AIRTABLE_T_MEME_RATINGS,
        filterParams: {clerk_user_id: postParams.clerk_user_id, postLink: postParams.postLink},
        fullData: true,
      })
      if (result.status === "success" && result.records.length > 0) {
        userRatingId = result.records[0].id;
      }

    } catch (e) {
      console.error("orcRateRatedMeme: getRecordsFromAirtable FAILED:", e);
      throw e;
    }
    
    //222// UPDATE USER RATING IN AIRTABLE
    try {
      await updateAirtableRecord({
        table: AIRTABLE_T_MEME_RATINGS,
        recordId: userRatingId,
        fields: { rating: String(postParams.rating) }
      });
      console.log("User rating updated to airtable successfully");

    } catch (e) {
      console.error("orcRateRatedMeme: updateAirtableRecord FAILED:", e);
      throw e;
    }


    let userRatingRecord;
    //222// GET PREVIOUS USER RATING IN CACHE
    try {
      const result = await getHashValuesFromCache({ keyPrefix: `userRating:${userId}`, valueParam: postParams.postLink});
      if (result.status === "success") {
        userRatingRecord = result.records;
      }

    } catch (e) {
      console.error("orcRateRatedMeme: getHashValuesFromCache FAILED:", e);
      throw e;
    }
    
    //222// AMEND RATING IN OBJECT
    userRatingRecord.rating = postParams.rating;
    
    //222// UPDATE USER RATING IN CACHE
    try {
      const result = await updateCacheHash({
        keyPrefix: "userRating",
        record: userRatingRecord,
        groupKeyField: "clerk_user_id",
        identifierField: "postLink",
      });
      console.log("Rating added to cache successfully");

    } catch (e) {
      console.error("orcRateRatedMeme: updateCacheHash FAILED:", e);
      throw e;
    }

    return {status: "success", message: "Updated rating"}
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  //222// IF NOT RATED BY USER, POST RATING TO AIRTABLE, ADD RATING TO CACHE, ADD POINTS TO USER AT, ADD POINTS TO CACHE
  if (flagRatingsExist && !flagUserRatingExist) {

    
    // POST/ADD RATING HERE
    //
    // 00000000000000000000000000000000 CAN BE ORC 
    //
    
    //222// POST RATING TO AIRTABLE 
    try {
      const result = await postToAirtable({sourceData, table: AIRTABLE_T_MEME_RATINGS, postParams}); 
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

    //222// ORC ADD POINTS
    try {
      const result = await orcAddPoints({sourceData, postParams, pointsToAdd: 2})
      console.log("orcRateRatedMeme: SUCCESS");
      
    } catch (e) {
      console.error("orcRateRatedMeme: orcAddPoints FAILED:", e);
      throw e;
    }

    return {status: "success", message: "Rated a rated meme"}
  }
}