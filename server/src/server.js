import express from "express";
import cors from "cors";

import test from "./routes/test.js";
import meme from "./routes/meme.js";
import { pingAirtable } from "./utils/airtableAPI.js";
import { getRandomMeme } from "./utils/memeAPI.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/test", test);
app.use("/meme", meme);

// Root
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Start server
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}...`);

  const ok = await pingAirtable();
  if (ok) {
    console.log("Airtable connection confirmed at startup.");
  } else {
    console.log("Airtable connection failed at startup.");
  }
});

console.log(getRandomMeme());
