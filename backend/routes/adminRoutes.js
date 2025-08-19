const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// 📂 ตั้งค่า multer สำหรับเก็บรูปโปรไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

/* =======================================================
   1) อนุมัติผู้ใช้งานที่มี role = company
======================================================= */
router.put('/approve-company/:companyId', async (req, res) => {
  const { companyId } = req.params;
  try {
    const [result] = await db.promise().query(
      "UPDATE users SET approval_status = 'approved' WHERE id = ? AND role = 'company' AND approval_status = 'pending'",
      [companyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบบริษัทนี้ในระบบ หรือไม่ได้อยู่ในสถานะรอการอนุมัติ' });
    }

    res.status(200).json({ message: '✅ อนุมัติบริษัทสำเร็จ' });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการอนุมัติบริษัท:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอนุมัติบริษัท' });
  }
});

/* =======================================================
   2) ลบบริษัท
======================================================= */
router.delete('/delete-company/:companyId', async (req, res) => {
  const { companyId } = req.params;
  try {
    const [company] = await db.promise().query("SELECT * FROM company WHERE company_id = ?", [companyId]);

    if (company.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลบริษัทในระบบ' });
    }

    await db.promise().query("DELETE FROM company WHERE company_id = ?", [companyId]);
    await db.promise().query("DELETE FROM users WHERE id = ? AND role = 'company'", [companyId]);

    res.status(200).json({ message: '✅ ลบบริษัทสำเร็จ' });
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการลบบริษัท:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบบริษัท' });
  }
});

/* =======================================================
   3) ดึงข้อมูลแอดมินตาม ID
======================================================= */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query("SELECT * FROM admin WHERE admin_id = ?", [id]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'ไม่พบแอดมิน' });
    }
  } catch (err) {
    console.error("❌ ดึงข้อมูลแอดมินผิดพลาด:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ server' });
  }
});

/* =======================================================
   4) อัปเดตข้อมูลแอดมิน + อัปโหลดรูป
======================================================= */
router.put('/:id', upload.single("profile_image"), async (req, res) => {
  const { id } = req.params;
  const { admin_name, email, phone_number } = req.body;

  // ถ้ามีการอัปโหลดไฟล์ใหม่ ใช้ชื่อไฟล์จาก multer
  const profileImage = req.file ? req.file.filename : req.body.profile_image;

  try {
    const [result] = await db.promise().query(
      `UPDATE admin SET admin_name = ?, email = ?, phone_number = ?, profile_image = ? WHERE admin_id = ?`,
      [admin_name, email, phone_number, profileImage, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบแอดมินนี้ในระบบ' });
    }

    res.json({ message: '✅ อัปเดตข้อมูลแอดมินสำเร็จ', profile_image: profileImage });
  } catch (err) {
    console.error("❌ UPDATE admin error:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
  }
});

/* =======================================================
   5) ดึงบริษัทที่ได้รับการอนุมัติ
======================================================= */
router.get('/companies/approved', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        u.id, u.email, u.approval_status,
        c.company_id, c.company_name, c.business_type, c.address, c.google_maps_link,
        c.contact_email, c.contact_name, c.phone_number, c.website, c.created_date,
        c.last_updated, c.company_logo
      FROM users u 
      JOIN company c ON u.id = c.company_id 
      WHERE u.role = 'company' AND u.approval_status = 'approved'`
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูลบริษัทที่ได้รับการอนุมัติ:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบริษัทที่ได้รับการอนุมัติ' });
  }
});

/* =======================================================
   6) ดึงบริษัทที่รอการอนุมัติ
======================================================= */
router.get('/companies/pending', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        u.id, u.email, u.approval_status,
        c.company_id, c.company_name, c.business_type, c.address, c.google_maps_link,
        c.contact_email, c.contact_name, c.phone_number, c.website, c.created_date,
        c.last_updated, c.company_logo
      FROM users u
      JOIN company c ON u.id = c.company_id
      WHERE u.role = 'company' AND u.approval_status = 'pending'`
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ ดึงบริษัทที่รออนุมัติผิดพลาด:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบริษัทที่รออนุมัติ' });
  }
});

/* =======================================================
   7) สมัคร user ใหม่ (instructor/supervisor)
======================================================= */
router.post("/register", async (req, res) => {
  const { id, name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(
      `INSERT INTO users (id, name, email, password, role, approval_status) VALUES (?, ?, ?, ?, ?, 'approved')`,
      [id, name, email, hashedPassword, role]
    );

    if (role === "supervisor") {
      await db.promise().query(
        `INSERT INTO supervisor (supervisor_id, supervisor_name, email) VALUES (?, ?, ?)`,

        [id, name, email]
      );
    }

    if (role === "instructor") {
      await db.promise().query(
        `INSERT INTO instructor (Instructor_id, Instructor_name, email) VALUES (?, ?, ?)`,

        [id, name, email]
      );
    }

    res.json({ message: `✅ สร้างบัญชี ${role} สำเร็จ` });
  } catch (err) {
    console.error("❌ Error สมัคร user:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

module.exports = router;
