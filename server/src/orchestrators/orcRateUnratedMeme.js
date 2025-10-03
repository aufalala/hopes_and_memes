import { AIRTABLE_T_MEME_RATINGS, AIRTABLE_T_RATED_MEMES, AIRTABLE_T_UNRATED_MEMES } from "../config.js";
import { deleteRecordsFromAirtable, postToAirtable } from "../services/airtableAPI.js";
import { deleteRecordsFromCache, updateCacheHash } from "../services/redisAPI.js";

import getTimestamp from "../utils/utTimestamp.js";
import { orcAddPoints } from "./orcAddPoints.js";
import { orcCheckUnrated } from "./orcCheckUnrated.js";

export async function orcRateUnratedMeme({sourceData, postParams}) {
  console.log(`[${getTimestamp()}] TRYING: orcRateUnratedMeme from ${sourceData}`);

  
  const deleteParams = {postLink: postParams.postLink}; 
  let memeData = [];
  let flagAirtableRatingPostSuccess = false;
  let flagCacheUnratedDeleteSuccess = false;
  let flagAirtableUnratedDeleteSuccess = false;
  let flagCacheLockDeleteSuccess = false;
  let flagAirtableMemePostSuccess = false;

  //222// POST RATING TO AIRTABLE
  try {
    const result = await postToAirtable({sourceData, table: AIRTABLE_T_MEME_RATINGS, postParams}); 
      if (result.status === "success") {
        flagAirtableRatingPostSuccess = true;
      }
  } catch (e) {
    console.error("orcRateUnratedMeme: postToAirtable FAILED:", e);
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
    console.error("orcRateUnratedMeme: updateCacheHash FAILED:", e);
    throw e;
  }
  
  //222// DELETE UNRATED MEME FROM CACHE
  if (flagAirtableRatingPostSuccess) {
    try {
      const result = await deleteRecordsFromCache({sourceData, table: AIRTABLE_T_UNRATED_MEMES, keyPrefix: "memes:unrated", deleteParams}); 
      if (result.status === "success") {
        flagCacheUnratedDeleteSuccess = true;
      }
    } catch (e) {
      console.error("orcRateUnratedMeme: deleteRecordsFromCache FAILED:", e);
      throw e;
    }
  }

  //222// DELETE UNRATED MEME FROM AIRTABLE
  if (flagCacheUnratedDeleteSuccess) {
    try {
      const result = await deleteRecordsFromAirtable({sourceData, table: AIRTABLE_T_UNRATED_MEMES, deleteParams}); 
      if (result.status === "success") {
        flagAirtableUnratedDeleteSuccess = true;
        memeData = result.deletedRecords[0].fields;
      }
    } catch (e) {
      console.error("orcRateUnratedMeme: deleteRecordsFromAirtable FAILED:", e);
      throw e;
    }
  }
  
  //222// DELETE LOCK UNRATED MEME
  if (flagAirtableUnratedDeleteSuccess) {
    try {
      const result = await deleteRecordsFromCache({sourceData, table: AIRTABLE_T_UNRATED_MEMES, keyPrefix: "lock:memes:unrated", deleteParams});
      if (result.status === "success") {
        flagCacheLockDeleteSuccess = true;
      }
    } catch (e) {
      console.error("orcRateUnratedMeme: deleteRecordsFromCache FAILED:", e);
      throw e;
    }
  }

  //222// update memeData payload to include firstRatedAt time
  memeData.first_rated_at = String(Date.now());

  //222// POST MEME TO AIRTABLE (RATED)
  if (flagCacheLockDeleteSuccess) {
    try {
      const result = await postToAirtable({sourceData, table: AIRTABLE_T_RATED_MEMES, postParams: memeData});
      if (result.status === "success") {
        flagAirtableMemePostSuccess = true;
      }
    } catch (e) {
      console.error("orcRateUnratedMeme: postToAirtable FAILED:", e);
      throw e;
    }
  }

  //222// ORC ADD POINTS
  try {
    const result = await orcAddPoints({sourceData, postParams, pointsToAdd: 5})
    if (result.status === "success") {
      console.log("orcRateUnratedMeme: orcAddPoints: SUCCESS");
    }
    
  } catch (e) {
    console.error("orcRateRatedMeme: orcAddPoints: FAILED:", e);
    throw e;
  }

  //222// ORC CHECK UNRATED
  try {
    const result = await orcCheckUnrated({sourceData})
    if (result.status === "success") {
      console.log("orcRateUnratedMeme: orcCheckUnrated: SUCCESS");
    }
    
  } catch (e) {
    console.error("orcRateRatedMeme: orcCheckUnrated: FAILED:", e);
    throw e;
  }


  return {status: "success", message: "Rated an unrated meme"}
    
}