import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { word } = req.query;
    if (!word) {
      return res.status(400).json({ error: "缺少参数 word" });
    }

    const appid = process.env.APP_ID;
    const key = process.env.KEY;
    if (!appid || !key) {
      return res.status(500).json({ error: "缺少百度翻译 APP_ID 或 KEY" });
    }

    const salt = Date.now();
    const sign = crypto.createHash("md5").update(appid + word + salt + key).digest("hex");

    const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(word)}&from=auto&to=zh&appid=${appid}&salt=${salt}&sign=${sign}`;

    const response = await fetch(url);
    const text = await response.text();

    if (text.startsWith("<!DOCTYPE")) {
      return res.status(502).json({ error: "百度翻译 API 返回 HTML，请检查 APP_ID/KEY" });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(502).json({ error: "返回数据不是 JSON", raw: text });
    }

    if (data.error_code) {
      return res.status(502).json({ error: "百度翻译接口报错", detail: data });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "服务器异常", detail: err.message });
  }
}
