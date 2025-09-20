export default function handler(req, res) {
  // 判断是否开启 debug 模式（在 URL 里加 ?debug=true）
  const isDebug = req.query.debug === "true";

  if (isDebug) {
    // ⚠️ 调试模式：直接返回真实值（线上不建议开）
    res.status(200).json({
      APP_ID: process.env.APP_ID || "❌ 未找到",
      KEY: process.env.KEY || "❌ 未找到"
    });
  } else {
    // 安全模式：只返回布尔值
    res.status(200).json({
      APP_ID: !!process.env.APP_ID,
      KEY: !!process.env.KEY
    });
  }
}

