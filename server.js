const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

/* ================= CONFIG ================= */
const SUPABASE_URL = "https://akibgftspolpbkbsmvux.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraWJnZnRzcG9scGJrYnNtdnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjE3MDMsImV4cCI6MjA3Nzk5NzcwM30.SdPKiR9Vx7Nf7ykwxBQAHsKiO7bOjA2uxIcBNLpm6d0";

/* ================= ROUTE ================= */
app.post("/gps", async (req, res) => {
  try {
    const data = req.body;

    console.log("📥 Received:", data);

    const payload = {
      device_id: data.device_id,
      latitude: data.lat,
      longitude: data.lon
    };

    await axios.post(
      `${SUPABASE_URL}/rest/v1/gps_data?on_conflict=device_id`,
      payload,
      {
        headers: {
          "apikey": SUPABASE_API_KEY,
          "Authorization": `Bearer ${SUPABASE_API_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        }
      }
    );

    console.log("✅ UPSERT SUCCESS");
    res.send("OK");

  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    res.status(500).send("FAIL");
  }
});

/* ================= START ================= */
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});