import "./config.js";

import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { connectRedis, default as redisConnection } from "./redis/connection.js";
import { workerStartAll } from "./redis/workers/workerStartAll.js";

import test from "./routes/test.js";
import meme from "./routes/meme.js";
import users from "./routes/users.js";
import redisRoutes from "./routes/redis.js";

import { pingAirtable } from "./services/airtableAPI.js";

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
  app.use("/api/users", users);
  app.use("/api/redis", redisRoutes)

  //111/////////////////////////////// --- ROOT
  app.get("/", (req, res) => res.send("Server is running! BUT YOU SHOULD'NT BE HERE :("));

  //111/////////////////////////////// --- SERVER START
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });

  //111/////////////////////////////// --- REDIS CONNECT
  try {
    await connectRedis();
    console.log("Redis connected successfully");
    workerStartAll(redisConnection);

  } catch (e) {
    console.error("Redis failed to connect:", e);
  }

  //111/////////////////////////////// --- PING AIRTABLE CHECK
  const ok = await pingAirtable("Server");
  if (ok && ok.message) console.log(ok.message);
  else console.log("pingAirtable FAILED.");
  
}

startServer();