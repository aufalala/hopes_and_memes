import express from "express";
import cors from "cors";

import "./redis/workers/workerStartAll.js";

import { clerkMiddleware } from "@clerk/express";

import test from "./routes/test.js";
import meme from "./routes/meme.js";
import users from "./routes/users.js";
import redis from "./routes/redis.js"

import { pingAirtable } from "./utils/airtableAPI.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

//111/////////////////////////////// --- ROUTES
app.use("/api/test", test);
app.use("/api/meme", meme);
app.use("/api/users", users);
app.use("/api/redis", redis)

//111/////////////////////////////// --- ROOT
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//111/////////////////////////////// --- SERVER START
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}...`);

  const ok = await pingAirtable("Server");
  if (ok  && ok.message) {  
    console.log(ok.message);
  } else {
    console.log("pingAirtable() failed or returned no message.");
  }
});
