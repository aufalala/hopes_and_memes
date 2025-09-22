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
redisConnection.on("error", (err) => console.error(`[${getTimestamp()}] Redis error:, err.message`));
redisConnection.on("close", () => console.log(`[${getTimestamp()}] Redis connection closed`));

//111/////////////////////////////// --- redisConnection CONNECT FUNCTION
export async function connectRedis() {
  if (redisConnection.status !== "ready") {
    try {
      await redisConnection.connect();
    } catch (err) {
      if (!err.message.includes("already connecting") && !err.message.includes("already connected")) {
        throw err;
      }
    }
  }

  return redisConnection;
}

export default redisConnection;