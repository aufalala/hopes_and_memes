import redisConnection from "../redis/connection.js";

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
export async function getUnratedMemes(sourceData) {
  console.log(`[${new Date().toISOString()}] TRYING: getUnratedMemes from ${sourceData}`);
  
  try {
    const keys = await redisConnection.keys(`${UNRATED_MEMES_CACHE_KEY}:*`);

    if (!keys || keys.length === 0) {
      throw new Error(`[${new Date().toISOString()}] getUnratedMemes: No memes found in cache`);
    }

    const values = await Promise.all(keys.map((key) => redisConnection.get(key)));

    const memes = values.map((val) => JSON.parse(val));

    const payload = {status: "success", memes}; 
    console.log(payload.memes)
    console.log(`[${new Date().toISOString()}] getUnratedMemes: get SUCCESS`);
    return payload;

  } catch (e) {
    console.error(`[${new Date().toISOString()}] getUnratedMemes: Meme retrieval failed:`, e);
    throw e;
  }

  
}
