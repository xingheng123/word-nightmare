export default function handler(req, res) {
  res.status(200).json({
    APP_ID_present: !!process.env.APP_ID,
    KEY_present: !!process.env.KEY,
    message:
      (!process.env.APP_ID || !process.env.KEY)
        ? "❌ 环境变量未配置完整，请检查 Vercel → Settings → Environment Variables"
        : "✅ 环境变量已配置，可以正常使用"
  });
}
