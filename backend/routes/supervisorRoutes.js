const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔍 GET: ดึงข้อมูลอาจารย์นิเทศตาม ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("🪵 GET /api/supervisor/:id =", id);
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM supervisor WHERE supervisor_id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลอาจารย์นิเทศ' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ GET supervisor error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// ✏️ PUT: แก้ไขข้อมูลอาจารย์นิเทศ
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    supervisor_name, email, phone_number, department,
    faculty, position, profile_image
  } = req.body;

  try {
    await db.promise().query(
      `UPDATE supervisor SET
        supervisor_name = ?, email = ?, phone_number = ?, department = ?,
        faculty = ?, position = ?, profile_image = ?
      WHERE supervisor_id = ?`,
      [supervisor_name, email, phone_number, department, faculty, position, profile_image, id]
    );
    res.json({ message: '✅ อัปเดตข้อมูลสำเร็จ' });
  } catch (err) {
    console.error('❌ PUT supervisor error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึก' });
  }
});

// ✅ GET: ดึงข้อมูลอาจารย์นิเทศทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM supervisor');
    res.json(rows);
  } catch (err) {
    console.error('❌ GET all supervisors error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลทั้งหมด' });
  }
});

/// ✅ ดึงนิสิตที่จับคู่กับอาจารย์นิเทศ พร้อมบริษัทและจังหวัด
router.get('/students/:supervisor_id', async (req, res) => {
  const { supervisor_id } = req.params;

  try {
    const [rows] = await db.promise().query(`
      SELECT 
        s.student_id, s.student_name, s.age, s.gender, s.phone_number,
        s.email, s.university, s.gpa, s.profile_image,
        c.company_name,
        j.address AS province
      FROM supervisor_selection ss
      JOIN student s ON ss.student_id = s.student_id
      LEFT JOIN application a ON s.student_id = a.student_id AND a.confirmed = 1
      LEFT JOIN job_posting j ON a.job_posting_id = j.job_posting_id
      LEFT JOIN company c ON j.company_id = c.company_id
      WHERE ss.supervisor_id = ?
    `, [supervisor_id]);

    res.json(rows);
  } catch (err) {
    console.error("❌ ดึงนิสิตในความดูแลล้มเหลว:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนิสิต' });
  }
});


module.exports = router;
