import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getSpotifyToken() {
  const authString = Buffer.from(
    process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + authString,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

app.get("/api/example", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.use(express.static(path.join(__dirname, "../Frontend")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

app.get("/getToken", async (req, res) => {
  const token = await getSpotifyToken();
  res.json({ access_token: token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
