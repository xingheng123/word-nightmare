// api/baiduTranslate.js
import crypto from "crypto";

function hasChinese(text){
  return /[\u4e00-\u9fff]/.test(text);
}

export default async function handler(req, res) {
  try {
    const word = (req.query.word || "").trim();
    if (!word) return res.status(400).json({ error: "missing word parameter" });

    const appid = process.env.APP_ID;
    const key = process.env.KEY;
    if (!appid || !key) {
      return res.status(500).json({ error: "Environment variables APP_ID or KEY not configured" });
    }

    // 自动识别方向：包含中文 -> zh->en，否则 en->zh
    const isZh = hasChinese(word);
    const from = isZh ? "zh" : "en";
    const to = isZh ? "en" : "zh";

    const salt = Date.now().toString();
    const sign = crypto.createHash("md5").update(appid + word + salt + key).digest("hex");
    const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(word)}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;

    // call Baidu
    const r = await fetch(url);
    const data = await r.json();

    // 如果百度返回 error_code，直接返回给前端以便调试
    if (data.error_code) {
      return res.status(200).json({ error: "baidu_error", error_code: data.error_code, error_msg: data.error_msg, raw: data });
    }

    // 正常返回
    return res.status(200).json(data);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "internal_error", message: err.message });
  }
}
