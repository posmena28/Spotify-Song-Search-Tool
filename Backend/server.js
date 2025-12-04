import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());

app.get("/token", async (req, res) => {
  const authString = Buffer.from(
    process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
  ).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + authString,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    res.json(data); // sends { access_token, token_type, expires_in } to frontend
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle all routes and send index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Your existing API routes
app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
