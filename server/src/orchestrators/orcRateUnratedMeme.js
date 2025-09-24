import { AIRTABLE_T_MEME_RATINGS, AIRTABLE_T_UNRATED_MEMES } from "../config.js";
import { deleteRecordsFromAirtable, postToAirtable } from "../services/airtableAPI.js";
import { deleteRecordsFromCache } from "../services/redisAPI.js";

import getTimestamp from "../utils/utTimestamp.js";

export async function orcRateUnratedMeme({sourceData, postParams}) {
  console.log(`[${getTimestamp()}] TRYING: orcRateUnratedMeme from ${sourceData}`);

  //222// POST RATING TO AIRTABLE
  try {
    const result = await postToAirtable({sourceData, table: AIRTABLE_T_MEME_RATINGS, postParams}); 
  } catch (e) {
    console.error("orcRateUnratedMeme: postToAirtable FAILED:", e);
    throw e;
  }

  const deleteParams = {postLink: postParams.postLink}; 
  let memeData = [];
  let flagAirtableDeleteSuccess = false;
  let flagCacheDeleteSuccess = false;
  let flagCacheLockDeleteSuccess = false;
  
  //222// DELETE UNRATED MEME FROM CACHE
  try {
    const result = await deleteRecordsFromCache({sourceData, table: AIRTABLE_T_UNRATED_MEMES, keyPrefix: "memes:unrated", deleteParams}); 
    if (result.status === "success") {
      flagCacheDeleteSuccess = true;
    }
  } catch (e) {
    console.error("orcRateUnratedMeme: postToAirtable FAILED:", e);
    throw e;
  }

  //222// DELETE UNRATED MEME FROM AIRTABLE
  try {
    const result = await deleteRecordsFromAirtable({sourceData, table: AIRTABLE_T_UNRATED_MEMES, deleteParams}); 
    if (result.status === "success") {
      flagAirtableDeleteSuccess = true;
      memeData = result.deleted;
    }
  } catch (e) {
    console.error("orcRateUnratedMeme: postToAirtable FAILED:", e);
    throw e;
  }
  
  //222// DELETE LOCK UNRATED MEME
  try {
    const result = await deleteRecordsFromCache({sourceData, table: AIRTABLE_T_UNRATED_MEMES, keyPrefix: "lock:memes:unrated", deleteParams});
    if (result.status === "success") {
      flagCacheLockDeleteSuccess = true;
    }
  } catch (e) {
    console.error("orcRateUnratedMeme: postToAirtable FAILED:", e);
    throw e;
  }
}