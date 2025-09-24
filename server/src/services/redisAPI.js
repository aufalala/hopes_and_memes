import redisConnection from "../redis/connection.js";
import getTimestamp from "../utils/utTimestamp.js";
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
  console.log(`[${getTimestamp()}] TRYING: uploadUnratedMemesToCache from ${sourceData}`);

  try {
    await Promise.all(
      memeArray.map((meme) => {
        const key = `${UNRATED_MEMES_CACHE_KEY}:${meme.postLink}`;
        return setRedisCache(key, meme);
      })
    );
    console.log(`[${getTimestamp()}] All memes cached successfully`);
  } catch (error) {
    console.error(`[${getTimestamp()}] Error setting cache in Redis:`, error);
  }
  return {status: "success"};
}


//111/////////////////////////////// --- GET UNRATED MEMES
export async function getUnratedMemesFromCache(sourceData) {
  console.log(`[${getTimestamp()}] TRYING: getUnratedMemes from ${sourceData}`);
  
  let memes = [];
  try {
    const keys = await redisConnection.keys(`${UNRATED_MEMES_CACHE_KEY}:*`);

    if (Array.isArray(keys) && keys.length > 0) {

      const values = await Promise.all(keys.map((key) => redisConnection.get(key)));

      memes = values.map((val) => JSON.parse(val));

      const payload = {status: "success", memes};
      console.log(`[${getTimestamp()}] getUnratedMemesFromCache: get SUCCESS`);
      return payload;
      
    } else {
      console.warn(`[${getTimestamp()}] getUnratedMemesFromCache: No memes found in cache`);
    }

  } catch (e) {
    console.error(`[${getTimestamp()}] getUnratedMemesFromCache: Cache unrated memes retrieval FAILED:`, e);
    throw e;
  }

  // If cache empty, getUnratedMemesFromAirtable. function will repopulate cache. If AT empty, trigger getTenMemes
  try {
    const result = await getUnratedMemesFromAirtable(sourceData);
    if (result.status !== "success") {
      return res.status(500).json(result);
    }

    console.log(`[${getTimestamp()}] getUnratedMemesFromCache: Unrated memes retrieved from Airtable`);
    const payload = {status: "success", memes: result.memes}
    return payload;

  } catch (e) {
    console.error(`[${getTimestamp()}] getUnratedMemesFromCache: Airtable unrated memes retrieval FAILED`, e);
    throw e;
  }

    
}



/////////////////////////////////

export async function getRecordsFromCache({sourceData, keyParam}) {
  console.log(`[${getTimestamp()}] TRYING: getRecordsFromCache from ${sourceData}`);
  try {
    const keys = await redisConnection.keys(`${UNRATED_MEMES_CACHE_KEY}:${keyParam}`);

    if (Array.isArray(keys) && keys.length > 0) {

      const values = await Promise.all(keys.map((key) => redisConnection.get(key)));

      const records = values.map((val) => JSON.parse(val));

      const payload = {status: "success", records};
      console.log(`[${getTimestamp()}] getRecordsFromCache: get SUCCESS, retrieved ${records.length} record(s)`);
      return payload;
      
    } else {
      console.warn(`[${getTimestamp()}] getRecordsFromCache: No records found in cache`);
      throw ("getRecordsFromCache: No records found in cache");
    }

  } catch (e) {
    console.error(`[${getTimestamp()}] getRecordsFromCache: Cache records retrieval FAILED:`, e);
    throw e;
  }
}

export async function lockUnratedMeme({sourceData, key}) {
  console.log(`[${getTimestamp()}] TRYING: lockUnratedMeme from ${sourceData}`);
  try {
    const lock = await redisConnection.set(key, "locked", 'NX', 'EX', 60);

    if (lock) {
      
      console.log(`[${getTimestamp()}] lockUnratedMeme: First to rate!`);
      return {status: "success", lock}
    } else {
      
      console.log(`[${getTimestamp()}] lockUnratedMeme: Not first?`);
      return {status: "success", lock}
    }
  } catch (e) {
    console.error(`[${getTimestamp()}] lockUnratedMeme: FAILED:`, e);
    throw e;
  }
}

export async function deleteRecordsFromCache({ keyPrefix, deleteParams = {}, sourceData }) {
  console.log(`[${getTimestamp()}] TRYING: deleteRecordsFromCache: ${keyPrefix} from ${sourceData}`);

  const keysToDelete = [];

  // BUILD KEYS
  for (const [field, value] of Object.entries(deleteParams)) {
    const key = `${keyPrefix}:${value}`;
    keysToDelete.push(key);
  }

  if (keysToDelete.length === 0) {
    console.warn(`[${getTimestamp()}] No keys to delete for ${keyPrefix}`);
    return { status: "no_keys", deleted: [] };
  }

  try {
    const deletedCount = await redisConnection.del(...keysToDelete);
    console.log(`[${getTimestamp()}] Deleted ${deletedCount} keys from cache for ${keyPrefix}:`,keysToDelete);
    return { status: "success", deletedKeys: keysToDelete };

  } catch (e) {
    console.error(`[${getTimestamp()}] deleteRecordsFromCache FAILED:`, e.message);
    throw e;
  }
}