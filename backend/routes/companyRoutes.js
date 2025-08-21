const express = require('express');
const router = express.Router();
const db = require('../db');

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
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    company_name,
    business_type,
    website,
    contact_email,
    contact_name,
    phone_number,
    address,
    google_maps_link,
    company_logo
  } = req.body;

  try {
    await db.promise().query(
      `UPDATE company SET 
        company_name = ?, 
        business_type = ?, 
        website = ?, 
        contact_email = ?, 
        contact_name = ?, 
        phone_number = ?, 
        address = ?, 
        google_maps_link = ?, 
        company_logo = ? 
      WHERE company_id = ?`,
      [company_name, business_type, website, contact_email, contact_name,
       phone_number, address, google_maps_link, company_logo, id]
    );

    res.json({ message: "✅ ข้อมูลบริษัทอัปเดตเรียบร้อย" });
  } catch (err) {
    console.error("❌ Update failed:", err);
    res.status(500).json({ message: "Update failed" });
  }
});


module.exports = router;
