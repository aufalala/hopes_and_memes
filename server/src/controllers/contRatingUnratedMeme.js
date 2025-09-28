
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
    created_at: String(Date.now()),
  }

  let unratedMemeExist = false;
  let memeLock = false;
  
  //222// CHECK IF UNRATED MEME EXIST IN CACHE
  try {
    const result = await getRecordsFromCache({sourceData, keyParam: postLink});
    if (result.status === "success" && result.records) {
      unratedMemeExist = true;
    }
  } catch (e) {
    console.error(`[${getTimestamp()}] getRecordsFromCache FAILED:`, e);
    throw e;
  }

  //222// LOCK MEME RECORD IN CACHE
  if (unratedMemeExist) {
    try {
      const result = await lockUnratedMeme({sourceData, key: `lock:memes:unrated:${postLink}`});

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

  //222// ATTEMPT ORC RATE UNRATED
  if (memeLock) {
    try {
      const result = await orcRateUnratedMeme({sourceData, postParams})
      if (result.status === "success") {
        return {status: "success"}
      }
    } catch (e) {
      console.error("orcRateUnratedMeme FAILED:", e);
      throw e;
    }
  }

  //222// DO ORC RATE RATED INSTEAD IF NOT FIRST
  // if statement !unratedMemeExist and unratedMemeExist cancel each other out - refer to flowchart - 
  if (!memeLock) {
    try {
      const result = await orcRateRatedMeme({sourceData, postParams, req})
      if (result.status === "success") {
        return {status: "success"}
      }

    } catch (e) {
      console.error("orcRateUnratedMeme FAILED:", e);
      throw e;
    }
  }
}