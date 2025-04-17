import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const MATRİKS_KEY = process.env.MATRİKS_KEY;          // Render > Environment
const MATRİKS_URL = "https://api.matriksdata.com/v1"; // örnek

app.get("/candles", async (req, res) => {
  const { symbol } = req.query;               // ?symbol=AKBNK
  try {
    // gerçek endpointini buraya koy
    const r = await fetch(
      `${MATRİKS_URL}/ohlc?symbol=${symbol}&interval=1d&apikey=${MATRİKS_KEY}`
    );
    const raw = await r.json();
    // Matriks formatını our chart formatına çevir
    const data = raw.map(c => ({
      time: Math.floor(new Date(c.date).getTime() / 1000),
      open: c.open, high: c.high, low: c.low, close: c.close
    }));
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "fetch failed" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Proxy ready on", PORT));
