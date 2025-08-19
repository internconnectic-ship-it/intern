// backend/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

// ✅ เก็บไฟล์ไป Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'internconnect/profile', // โฟลเดอร์ใน Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => Date.now(), // ตั้งชื่อไฟล์ไม่ซ้ำ
  },
});

const upload = multer({ storage });

// 📤 upload image
router.post('/profile-image', upload.single('image'), (req, res) => {
  try {
    // ✅ Cloudinary จะคืน URL มาใน req.file.path
    res.json({ url: req.file.path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
