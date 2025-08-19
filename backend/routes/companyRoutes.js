const express = require('express');
const router = express.Router();
const db = require('../db');
const upload = require('../middleware/uploadCloudinary');

// 📌 GET: ข้อมูลบริษัท
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM company WHERE company_id = ?', [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลบริษัทนี้' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบริษัท' });
  }
});

// 📌 PUT: อัปเดตข้อมูลบริษัท (พร้อมอัปโหลดรูป)
router.put('/:id', upload.single('profile_image'), async (req, res) => {
  const { id } = req.params;
  const {
    company_name, business_type, address, google_maps_link,
    contact_email, contact_name, phone_number, website
  } = req.body;

  const profileImageUrl = req.file ? req.file.path : req.body.profile_image;

  try {
    await db.promise().query(
      `UPDATE company SET
        company_name = ?, business_type = ?, address = ?, google_maps_link = ?, 
        contact_email = ?, contact_name = ?, phone_number = ?, website = ?, 
        profile_image = ?, last_updated = NOW()
      WHERE company_id = ?`,
      [company_name, business_type, address, google_maps_link,
       contact_email, contact_name, phone_number, website,
       profileImageUrl, id]
    );
    res.json({ message: '✅ อัปเดตข้อมูลบริษัทเรียบร้อยแล้ว', profile_image: profileImageUrl });
  } catch (err) {
    res.status(500).json({ message: '❌ ไม่สามารถอัปเดตข้อมูลบริษัทได้', error: err.sqlMessage });
  }
});

module.exports = router;
