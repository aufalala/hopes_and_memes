import redisConnection from "../redis/connection.js";
import { getUnratedMemesFromAirtable } from "./airtableAPI.js";

const UNRATED_MEMES_CACHE_KEY = "memes:unrated";


//111/////////////////////////////// --- SET REDIS CACHE
export async function setRedisCache(key, data, ttl) {
  if (ttl) {
    await redisConnection.set(key, JSON.stringify(data), 'EX', ttl);
  } else {
    await redisConnection.set(key, JSON.stringify(data));
  }
}


//111/////////////////////////////// --- UPLOAD UNRATED MEMES
export async function uploadUnratedMemesToCache(sourceData, memeArray) {
  console.log(`[${new Date().toISOString()}] TRYING: uploadUnratedMemesToCache from ${sourceData}`);

  try {
    await Promise.all(
      memeArray.map((meme) => {
        const key = `${UNRATED_MEMES_CACHE_KEY}:${meme.postLink}`;
        return setRedisCache(key, meme);
      })
    );
    console.log(`[${new Date().toISOString()}] All memes cached successfully`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error setting cache in Redis:`, error);
  }
  return {status: "success"};
}


//111/////////////////////////////// --- GET UNRATED MEMES
export async function getUnratedMemesFromCache(sourceData) {
  console.log(`[${new Date().toISOString()}] TRYING: getUnratedMemes from ${sourceData}`);
  
  let memes = [];
  try {
    const keys = await redisConnection.keys(`${UNRATED_MEMES_CACHE_KEY}:*`);

    if (Array.isArray(keys) && keys.length > 0) {

      const values = await Promise.all(keys.map((key) => redisConnection.get(key)));

      memes = values.map((val) => JSON.parse(val));

      const payload = {status: "success", memes};
      console.log(`[${new Date().toISOString()}] getUnratedMemesFromCache: get SUCCESS`);
      return payload;
      
    } else {
      console.warn(`[${new Date().toISOString()}] getUnratedMemesFromCache: No memes found in cache`);
    }

  } catch (e) {
    console.error(`[${new Date().toISOString()}] getUnratedMemesFromCache: Cache unrated memes retrieval FAILED:`, e);
    throw e;
  }

  // If cache empty, getUnratedMemesFromAirtable. function will repopulate cache. If AT empty, trigger getTenMemes
  try {
    const result = await getUnratedMemesFromAirtable(sourceData);
    if (result.status !== "success") {
      return res.status(500).json(result);
    }

    console.log(`[${new Date().toISOString()}] getUnratedMemesFromCache: Unrated memes retrieved from Airtable`);
    const payload = {status: "success", memes: result.memes}
    return payload;

  } catch (e) {
    console.error(`[${new Date().toISOString()}] getUnratedMemesFromCache: Airtable unrated memes retrieval FAILED`, e);
    throw e;
  }

    
}
