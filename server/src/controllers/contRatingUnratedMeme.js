
import { getAuth } from "@clerk/express";

import { getRecordsFromCache, lockUnratedMeme } from "../services/redisAPI.js";

import { orcRateRatedMeme } from "../orchestrators/orcRateRatedMeme.js";
import { orcRateUnratedMeme } from "../orchestrators/orcRateUnratedMeme.js";

import getTimestamp from "../utils/utTimestamp.js";

export async function contRatingUnratedMemes(sourceData, req) {
  console.log(`[${getTimestamp()}] TRYING: contRatingUnratedMemes from ${sourceData}`);

  const {postLink, rating} = req.body;
  const {userId} = getAuth(req);
  const postParams = {
    clerk_user_id: userId,
    postLink,
    rating,
    created_at: Date.now()
  }

  let unratedMemeExist = false;
  let memeLock = false;
  
  try {
    const result = await getRecordsFromCache({sourceData, keyParam: postLink});
    if (result.status === "success") {
      unratedMemeExist = true;
    }
  } catch (e) {
    console.error(`[${getTimestamp()}] getRecordsFromCache FAILED:`, e);
    throw e;
  }

  if (unratedMemeExist) {
    try {
      const result = await lockUnratedMeme({sourceData, keyParam: `memes:unrated:${postLink}`});

      if (result.status === "success" && result.lock) {
        memeLock = true;
      } else if (result.status === "success" && !result.lock) {
        memeLock = false;
      }

    } catch (e) {
      console.error(`[${getTimestamp()}] lockUnratedMeme FAILED:`, e);
      throw e;
    }
  }

  
  if (memeLock) {
    try {
      const result = await orcRateUnratedMeme({sourceData, postParams})

    } catch (e) {
      console.error("orcRateUnratedMeme FAILED:", e);
      throw e;
    }
  }


  if (!memeLock && !unratedMemeExist) {
    try {
      const result = await orcRateRatedMeme({sourceData, postParams})

    } catch (e) {
      console.error("orcRateUnratedMeme FAILED:", e);
      throw e;
    }
  }

  return {status: "success"}
  // const {postLink} = req.body

  // try {
  //   getRecordsFromAirtable({sourceData, table: AIRTABLE_T_UNRATED_MEMES, filterParams: {postLink}})
  // } catch (e) {

  // }
}