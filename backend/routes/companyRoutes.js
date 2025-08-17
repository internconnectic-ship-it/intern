const express = require('express');
const router = express.Router();
const db = require('../db');

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
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบริษัท' });
  }
});


// ✏️ แก้ไขข้อมูลบริษัท
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    company_name, business_type, address, google_maps_link, contact_email,
    contact_name, phone_number, website, company_logo
  } = req.body;

  try {
    await db.promise().query(
      `UPDATE company SET
        company_name = ?, business_type = ?, address = ?, google_maps_link = ?, 
        contact_email = ?, contact_name = ?, phone_number = ?, website = ?, 
        company_logo = ?, last_updated = NOW()
        WHERE company_id = ?`,
      [
        company_name, business_type, address, google_maps_link, contact_email,
        contact_name, phone_number, website, company_logo, id
      ]
    );
    res.json({ message: '✅ อัปเดตข้อมูลบริษัทเรียบร้อยแล้ว' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ ไม่สามารถอัปเดตข้อมูลบริษัทได้', error: err.sqlMessage });
  }
});

module.exports = router;
