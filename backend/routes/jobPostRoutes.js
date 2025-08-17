const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// ▶️ ตั้งค่าเก็บไฟล์ resume
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ นักศึกษาสมัครงาน
router.post('/apply', upload.single('resume'), async (req, res) => {
  const { student_id, job_posting_id } = req.body;
  const resumePath = req.file ? req.file.filename : null;
  const applyDate = new Date().toISOString().split('T')[0];

  try {
    const [result] = await db.promise().query(
      `INSERT INTO application (student_id, job_posting_id, apply_date, resume_file, status)
       VALUES (?, ?, ?, ?, ?)`,
      [student_id, job_posting_id, applyDate, resumePath, 0]
    );
    res.status(201).json({ message: '✅ สมัครสำเร็จ', result });
  } catch (err) {
    console.error('❌ สมัครไม่สำเร็จ:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.sqlMessage || err.message });
  }
});

// ✅ เพิ่มประกาศงานใหม่
router.post('/', async (req, res) => {
  const {
    company_id, position, business_type, job_description, requirements,
    compensation, max_positions, address, google_maps_link,
    start_date, end_date, email, phone_number
  } = req.body;

  try {
    const sql = `INSERT INTO job_posting (
      company_id, position, business_type, job_description, requirements,
      compensation, max_positions, address, google_maps_link,
      start_date, end_date, email, phone_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.promise().query(sql, [
      company_id, position, business_type, job_description, requirements,
      parseFloat(compensation), parseInt(max_positions), address,
      google_maps_link, start_date, end_date, email, phone_number
    ]);

    res.status(201).json({ message: '✅ เพิ่มประกาศงานสำเร็จ', job_posting_id: result.insertId });
  } catch (err) {
    console.error('❌ เพิ่ม job posting ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะเพิ่มประกาศงาน', error: err.sqlMessage || err.message });
  }
});

// ✅ ดึงประกาศงานเฉพาะบริษัท
router.get('/company/:company_id', async (req, res) => {
  const { company_id } = req.params;

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM job_posting WHERE company_id = ? ORDER BY job_posting_id DESC',
      [company_id]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ ดึง job posting ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: err.sqlMessage || err.message });
  }
});

// ✅ ลบประกาศงาน
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // ตรวจสอบก่อนว่ามีคนสมัครแล้วหรือยัง
    const [check] = await db.promise().query(
      'SELECT * FROM application WHERE job_posting_id = ?',
      [id]
    );

    if (check.length > 0) {
      return res.status(400).json({ message: 'ไม่สามารถลบได้ เนื่องจากมีนิสิตสมัครแล้ว' });
    }

    const [result] = await db.promise().query(
      'DELETE FROM job_posting WHERE job_posting_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบประกาศงานที่ต้องการลบ' });
    }

    res.json({ message: '✅ ลบประกาศงานเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('❌ ลบประกาศล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบประกาศ', error: err.sqlMessage || err.message });
  }
});


// ✅ ดึงประกาศงานทั้งหมด (พร้อมชื่อบริษัท)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT jp.*, c.company_name, c.company_logo
      FROM job_posting jp
      JOIN company c ON jp.company_id = c.company_id
      ORDER BY jp.job_posting_id DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ ดึง job postings ทั้งหมดล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลทั้งหมด', error: err.sqlMessage || err.message });
  }
});

// ✅ แก้ไขประกาศงาน
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    position, business_type, job_description, requirements,
    compensation, max_positions, address, google_maps_link,
    start_date, end_date, email, phone_number
  } = req.body;

  try {
    const [result] = await db.promise().query(
      `UPDATE job_posting SET
        position = ?, business_type = ?, job_description = ?, requirements = ?,
        compensation = ?, max_positions = ?, address = ?, google_maps_link = ?,
        start_date = ?, end_date = ?, email = ?, phone_number = ?
      WHERE job_posting_id = ?`,
      [
        position, business_type, job_description, requirements,
        parseFloat(compensation), parseInt(max_positions), address,
        google_maps_link, start_date, end_date, email, phone_number, id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบประกาศงานที่ต้องการแก้ไข' });
    }

    res.json({ message: '✅ แก้ไขประกาศงานเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('❌ แก้ไขประกาศล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไขประกาศ', error: err.sqlMessage || err.message });
  }
});

// ✅ ตรวจสอบว่านิสิตเคยสมัครตำแหน่งนี้หรือยัง
router.get('/check-application', async (req, res) => {
  const { student_id, job_posting_id } = req.query;

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM application WHERE student_id = ? AND job_posting_id = ?',
      [student_id, job_posting_id]
    );

    if (rows.length > 0) {
      res.json({ applied: true }); // ✅ เคยสมัครแล้ว
    } else {
      res.json({ applied: false }); // ❌ ยังไม่เคยสมัคร
    }
  } catch (err) {
    console.error('❌ ตรวจสอบการสมัครล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// ✅ ดึงรายละเอียดประกาศงานตาม ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("📦 job_posting_id ที่รับมา:", id);

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM job_posting WHERE job_posting_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบประกาศงาน' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('❌ ดึงประกาศงานล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: err.sqlMessage || err.message });
  }
});

// ✅ ดึงข้อมูลนิสิตที่สมัครเข้ามากับบริษัทนั้น
router.get('/applications/:company_id', async (req, res) => {
  const { company_id } = req.params;

  try {
    const [rows] = await db.promise().query(`
      SELECT 
        a.*, s.student_name, s.email, s.phone_number, s.major, s.faculty, jp.position, jp.business_type  
      FROM application a
      JOIN job_posting jp ON a.job_posting_id = jp.job_posting_id
      JOIN student s ON a.student_id = s.student_id
      WHERE jp.company_id = ?
      ORDER BY a.apply_date DESC
    `, [company_id]);

    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ ดึงข้อมูลนิสิตที่สมัครล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: err.message });
  }
});

// ✅ อัปเดตสถานะการสมัคร
router.put('/application/status/:application_id', async (req, res) => {
  const { application_id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.promise().query(
      'UPDATE application SET status = ? WHERE application_id = ?',
      [status, application_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูล application ที่ต้องการอัปเดต' });
    }

    res.json({ message: '✅ อัปเดตสถานะเรียบร้อย' });
  } catch (err) {
    console.error('❌ อัปเดตสถานะล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});



module.exports = router;
