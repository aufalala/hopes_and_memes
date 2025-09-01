import express from "express";
import cors from "cors";

import statusRoutes from "./routes/status.js";
import { pingAirtable } from "./utils/airtable.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/status", statusRoutes);

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
