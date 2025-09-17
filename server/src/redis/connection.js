import IORedis from "ioredis";

//111/////////////////////////////// --- redisConnection
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

//111/////////////////////////////// --- redisConnection LISTENERS
redisConnection.on("connect", () => console.log("Redis connecting..."));
redisConnection.on("ready", () => console.log("Redis ready!"));
redisConnection.on("error", (err) => console.error("Redis error:", err.message));
redisConnection.on("close", () => console.log("Redis connection closed"));


export default redisConnection;