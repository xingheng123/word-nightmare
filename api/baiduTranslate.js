import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "缺少 query 参数" });
    }

    const appid = process.env.APP_ID;  // Vercel 环境变量
    const key = process.env.KEY;       // Vercel 环境变量
    const salt = Date.now().toString();
    const str1 = appid + query + salt + key;
    const sign = crypto.createHash("md5").update(str1).digest("hex");

    const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(query)}&from=auto&to=zh&appid=${appid}&salt=${salt}&sign=${sign}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error_code) {
      return res.status(500).json({ error: "Baidu API 错误", detail: data });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "服务器错误", detail: err.message });
  }
}
