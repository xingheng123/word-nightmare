// server.js (确保与下列一致)
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(cors());

// 托管 public 且禁用静态缓存（开发用，重启后可移除）
app.use(express.static(path.join(__dirname, 'public'), { etag: false, maxAge: 0 }));

// TODO: 填你的百度 APPID / KEY
const appid = process.env.APP_ID;
const key = process.env.KEY;


app.get('/api/baiduTranslate', async (req, res) => {
  try {
    const q = req.query.word || '';
    const salt = Date.now();
    const sign = crypto.createHash('md5').update(appid + q + salt + key).digest('hex');
    const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(q)}&from=en&to=zh&appid=${appid}&salt=${salt}&sign=${sign}`;
    console.log('Request to Baidu:', url);
    const r = await fetch(url);
    const data = await r.json();
    console.log('Baidu response:', data);
    return res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '翻译失败' });
  }
});

const port = 3000;
app.listen(port, () => console.log(`服务器运行在 http://localhost:${port}`));
