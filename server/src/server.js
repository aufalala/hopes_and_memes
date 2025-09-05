import express from "express";
import cors from "cors";

import { clerkMiddleware } from '@clerk/express';


import test from "./routes/test.js";
import meme from "./routes/meme.js";
import users from "./routes/users.js";

import { pingAirtable } from "./utils/airtableAPI.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());


// Routes
app.use("/test", test);
app.use("/meme", meme);
app.use("/users", users)

// Root
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Start server
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}...`);

  const ok = await pingAirtable();
  if (ok  && ok.message) {
    console.log(ok.message);
  } else {
    console.log("pingAirtable() failed or returned no message.");
  }
});

