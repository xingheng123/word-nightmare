// /api/baiduTranslate.js
import crypto from "crypto";

export default async function handler(req, res) {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "missing q parameter" });

  const appid = process.env.APP_ID;
  const key = process.env.KEY;
  if (!appid || !key) {
    return res.status(500).json({ error: "missing APP_ID or KEY" });
  }

  const salt = Date.now();
  const sign = crypto.createHash("md5").update(appid + q + salt + key).digest("hex");
  const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(q)}&from=auto&to=zh&appid=${appid}&salt=${salt}&sign=${sign}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    if (text.startsWith("<!DOCTYPE")) {
      return res.status(502).json({ error: "Baidu API returned HTML, check APP_ID/KEY" });
    }
    const data = JSON.parse(text);
    if (data.error_code) {
      return res.status(502).json({ error: "baidu_error", detail: data });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Translate API error:", err);
    res.status(500).json({ error: "internal error", detail: err.message });
  }
}
