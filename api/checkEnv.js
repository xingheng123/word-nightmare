// /api/checkEnv.js
export default function handler(req, res) {
  res.status(200).json({
    APP_ID_present: !!process.env.APP_ID,
    KEY_present: !!process.env.KEY
  });
}
