const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// ตั้งค่า multer สำหรับเก็บไฟล์
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 📤 อัปโหลดรูป
router.post('/profile-image', upload.single('image'), (req, res) => {
  res.json({ filename: req.file.filename });
});

module.exports = router;
