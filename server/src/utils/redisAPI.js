import { setMemeCache } from "../redis/cache/unratedMemesCache.js";

const UNRATED_MEMES_CACHE_KEY_PREFIX = "memes:unrated:";

export async function uploadUnratedMemesToCache(sourceData, memeArray) {
  console.log(`[${new Date().toISOString()}] TRYING: uploadUnratedMemesToCache from ${sourceData}`);

  try {
    await Promise.all(
      memeArray.map((meme) => {
        const key = `${UNRATED_MEMES_CACHE_KEY_PREFIX}${meme.postLink}`;
        return setMemeCache(key, meme);
      })
    );
    console.log(`[${new Date().toISOString()}] All memes cached successfully`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error setting cache in Redis:`, error);
  }
  return {status: "success"};
}
