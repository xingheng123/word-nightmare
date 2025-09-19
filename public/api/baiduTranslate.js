import crypto from "crypto";

export default async function handler(req, res) {
  const { word } = req.query;

  if (!word) {
    return res.status(400).json({ error: "请输入单词" });
  }

  const appid = process.env.APP_ID; // 在 Vercel 设置的环境变量
  const key = process.env.KEY;      // 在 Vercel 设置的环境变量
  const salt = Date.now();
  const sign = crypto
    .createHash("md5")
    .update(appid + word + salt + key)
    .digest("hex");

  const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(
    word
  )}&from=en&to=zh&appid=${appid}&salt=${salt}&sign=${sign}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "调用百度翻译失败", details: error });
  }
}
