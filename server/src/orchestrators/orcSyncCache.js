import { AIRTABLE_T_ALL_USERS, AIRTABLE_T_MEME_RATINGS, AIRTABLE_T_UNRATED_MEMES } from "../config.js";
import redisConnection from "../redis/connection.js";

import { syncCache } from "../redis/syncCache.js";
import { syncCacheHash } from "../redis/syncCacheHash.js";

import getTimestamp from "../utils/utTimestamp.js";

export async function orcSyncCache() {
  console.log(`[${getTimestamp()}] TRYING: orcSyncCache: starting cache refresh...`);
  const sourceData = "Server"

  try {
    // Delete cache data
    await redisConnection.flushdb();
    console.log(`[${getTimestamp()}] orcSyncCache: Redis cache cleared`);

    // Hydrate cache data
    await syncCache({table: AIRTABLE_T_UNRATED_MEMES, keyPrefix: "memes:unrated", useKeySuffix: "postLink", sourceData, });
    await syncCache({table: AIRTABLE_T_ALL_USERS, keyPrefix: "users", useKeySuffix: "clerk_user_id", sourceData, });
    await syncCacheHash({table: AIRTABLE_T_MEME_RATINGS, keyPrefix: "userRating", useKeySuffix: "clerk_user_id", useIdentifierHash: "postLink", sourceData, });

    console.log(`[${getTimestamp()}] orcSyncCache: cache hydrated successfully`);

  } catch (e) {
    console.error(`[${getTimestamp()}] orcSyncCache: failed ->`, e.message);
    throw e;
  }
}
