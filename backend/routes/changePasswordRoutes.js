// backend/routes/changePasswordRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// 🔐 เปลี่ยนรหัสผ่าน (ใช้ตาราง users เท่านั้น)
router.post('/', async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;

  if (!id || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    // 1) หา user จากตาราง users
    const [rows] = await db.promise().query(
      `SELECT password FROM users WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "❌ ไม่พบผู้ใช้" });
    }

    // 2) ตรวจสอบรหัสผ่านเก่า
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ รหัสผ่านปัจจุบันไม่ถูกต้อง" });
    }

    // 3) hash รหัสใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4) update ที่ตาราง users
    await db.promise().query(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedPassword, id]
    );

    res.json({ message: "✅ เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (err) {
    console.error("❌ ERROR change-password:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดใน server" });
  }
});

module.exports = router;
