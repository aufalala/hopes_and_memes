// ENV VARIABLES
import "./config.js";

// MIDDLEWARE
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

// REDIS
import { connectRedis, default as redisConnection } from "./redis/connection.js";
import { orcSyncCache } from "./orchestrators/orcSyncCache.js";
import { workerStartAll } from "./redis/workerUtils/workerStartAll.js";

// ROUTES
import test from "./routes/test.js";
import meme from "./routes/meme.js";
import airtable from "./routes/airtable.js";
import users from "./routes/users.js";
import redisRoutes from "./routes/redis.js";

// SERVICES
import { pingAirtable } from "./services/airtableAPI.js";
import { orcCheckUnrated } from "./orchestrators/orcCheckUnrated.js";

// UTILS
import getTimestamp from "./utils/utTimestamp.js";

// LAUNCH SERVER
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  //111/////////////////////////////// --- MIDDLEWARE
  app.use(cors());
  app.use(express.json());
  app.use(clerkMiddleware());

  //111/////////////////////////////// --- ROUTES
  app.use("/api/test", test);
  app.use("/api/meme", meme);
  
  app.use("/api/airtable", airtable);
  app.use("/api/users", users);
  app.use("/api/redis", redisRoutes)

  //111/////////////////////////////// --- REDIS CONNECT
  try {
    await connectRedis();
    console.log(`[${getTimestamp()}] Redis connected successfully`);
    await orcSyncCache();
    workerStartAll(redisConnection);

  } catch (e) {
    console.error(`[${getTimestamp()}] Redis failed to connect:`, e);
  }

  //111/////////////////////////////// --- SERVER START
  const server = app.listen(PORT, () => {
    console.log(`[${getTimestamp()}] Listening on port ${PORT}...`);
  });

  //111/////////////////////////////// --- ROOT
  app.get("/", (req, res) => res.send("Server is running! BUT YOU SHOULDN'T BE HERE :("));

  //111/////////////////////////////// --- PING AIRTABLE CHECK
  const ok = await pingAirtable("Server");
  if (ok && ok.message) {
    console.log(`[${getTimestamp()}] ${ok.message}`);
  } else console.log(`[${getTimestamp()}] pingAirtable FAILED`);
 
  //111/////////////////////////////// --- UNRATED MEME COUNT CHECK
  try {
    const result = await orcCheckUnrated({sourceData})
    if (result.status === "success") {
      console.log("orcRateUnratedMeme: orcCheckUnrated: SUCCESS");
    }
    
  } catch (e) {
    console.error("orcRateRatedMeme: orcCheckUnrated: FAILED:", e);
    throw e;
  }

}

startServer();