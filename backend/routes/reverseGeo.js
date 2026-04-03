const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); // Node < 18

router.get("/", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    let attempts = 0;
    let data;
    while (attempts < 3) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          {
            headers: { "User-Agent": "eventManagement/1.0 (bansalantra21@gmail.com)" },
            signal: controller.signal,
          }
        );

        if (!response.ok) throw new Error("Geocoding service failed");

        data = await response.json();
        break; // success
      } catch (err) {
        attempts++;
        if (attempts === 3) throw err; // after 3 attempts fail
      }
    }

    clearTimeout(timeout);
    return res.json(data);
  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(504).json({ error: "Geocoding request timed out" });
    }
    console.error("Nominatim error:", error);
    return res.status(500).json({ error: "Failed to fetch address" });
  }
});

module.exports = router;
