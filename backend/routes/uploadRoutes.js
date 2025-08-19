// backend/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/profile/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 📤 upload image
router.post('/profile-image', upload.single('image'), (req, res) => {
  const imagePath = `/uploads/profile/${req.file.filename}`;
  res.json({ url: imagePath });
});

module.exports = router;
