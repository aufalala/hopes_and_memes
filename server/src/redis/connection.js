import IORedis from "ioredis";

//111/////////////////////////////// --- CONNECTION
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

//111/////////////////////////////// --- CONNECTION LISTENERS
connection.on("connect", () => console.log("Redis connecting..."));
connection.on("ready", () => console.log("Redis ready!"));
connection.on("error", (err) => console.error("Redis error:", err.message));
connection.on("close", () => console.log("Redis connection closed"));


export default connection;