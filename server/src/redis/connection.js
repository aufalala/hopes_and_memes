import IORedis from "ioredis";
import getTimestamp from "../utils/utTimestamp.js";

//111/////////////////////////////// --- redisConnection
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  tls: redisUrl.startsWith("rediss://") ? {} : undefined,
});

//111/////////////////////////////// --- redisConnection LISTENERS
redisConnection.on("connect", () => console.log(`[${getTimestamp()}] Redis connecting...`));
redisConnection.on("ready", () => console.log(`[${getTimestamp()}] Redis ready!`));
redisConnection.on("error", (e) => console.error(`[${getTimestamp()}] Redis error:`, e.message));
redisConnection.on("close", () => console.log(`[${getTimestamp()}] Redis connection closed`));

//111/////////////////////////////// --- redisConnection CONNECT FUNCTION
export async function connectRedis() {
  if (redisConnection.status !== "ready") {
    try {
      await redisConnection.connect();
    } catch (e) {
      if (!e.message.includes("already connecting") && !e.message.includes("already connected")) {
        throw e;
      }
    }
  }

  return redisConnection;
}

export default redisConnection;