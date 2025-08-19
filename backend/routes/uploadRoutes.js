// backend/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

// 🔑 config Cloudinary (อ่านจาก .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📂 เก็บลงโฟลเดอร์ profile
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// 📤 Upload profile image
router.post('/profile-image', upload.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: '❌ ไม่พบไฟล์อัปโหลด' });
  }

  // ✅ Cloudinary จะส่ง url มาใน req.file.path
  res.json({
    url: req.file.path,
    public_id: req.file.filename,
  });
});

module.exports = router;
