const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

/* 🔥 IMPORTANT FIX */
app.set("trust proxy", true);   // tell Express it's behind proxy

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

    // 🔥 VALIDATION (important for debugging)
    if (!data.device_id || !data.lat || !data.lon) {
      console.log("❌ Invalid payload");
      return res.status(400).send("BAD DATA");
    }

    const payload = {
      device_id: data.device_id,
      latitude: data.lat,
      longitude: data.lon
    };

    const response = await axios.post(
      `${SUPABASE_URL}/rest/v1/gps_data?on_conflict=device_id`,
      payload,
      {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates"
        }
      }
    );

    console.log("✅ SUPABASE RESPONSE:", response.status);

    res.status(200).send("OK");

  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    res.status(500).send("FAIL");
  }
});

/* ================= ROOT CHECK ================= */
app.get("/", (req, res) => {
  res.send("GPS SERVER RUNNING");
});

/* ================= START ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
