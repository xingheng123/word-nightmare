import crypto from "crypto";

export default async function handler(req, res) {
  const { word } = req.query;

  if (!word) {
    res.status(400).json({ error: "缺少参数 word" });
    return;
  }

  const appid = process.env.APP_ID;
  const key = process.env.KEY;

  if (!appid || !key) {
    res.status(500).json({ error: "环境变量 APP_ID 或 KEY 未配置" });
    return;
  }

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
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "调用百度翻译失败", detail: err.message });
  }
}
