const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ อัปเดตข้อมูลอาจารย์ประจำวิชา
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    Instructor_name,
    email,
    phone_number,
    department,
    faculty,
    position,
    profile_image
  } = req.body;

  try {
    await db.promise().query(
      `UPDATE instructor SET 
        Instructor_name = ?, 
        email = ?, 
        phone_number = ?, 
        department = ?, 
        faculty = ?, 
        position = ?, 
        profile_image = ?
      WHERE Instructor_id = ?`,
      [Instructor_name, email, phone_number, department, faculty, position, profile_image, id]
    );
    res.json({ message: '✅ อัปเดตข้อมูลอาจารย์เรียบร้อยแล้ว' });
  } catch (err) {
    console.error('❌ อัปเดตข้อมูลล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
  }
});

// ✅ ดึงนิสิตทั้งหมด (ไม่จำกัด instructor)
router.get('/students', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT student_id, student_name, email FROM student`
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ ดึงข้อมูลนิสิตทั้งหมดล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนิสิต' });
  }
});

// ✅ ดึงรายชื่ออาจารย์นิเทศจากตาราง supervisor
router.get('/all', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT supervisor_id, supervisor_name FROM supervisor`
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ ดึงรายชื่อ supervisor ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงรายชื่ออาจารย์นิเทศ' });
  }
});

// ✅ รายงานนิสิตยืนยันฝึกงาน: บริษัท, ตำแหน่ง, จำนวน
router.get('/internship-report', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        c.company_name,
        j.position,
        COUNT(a.student_id) AS student_count
      FROM application a
      JOIN job_posting j ON a.job_posting_id = j.job_posting_id
      JOIN company c ON j.company_id = c.company_id
      WHERE a.confirmed = 1
      GROUP BY c.company_name, j.position
    `);

    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.company_name]) {
        grouped[row.company_name] = [];
      }
      grouped[row.company_name].push({
        position: row.position,
        student_count: row.student_count
      });
    });

    const formatted = Object.entries(grouped).map(([company_name, positions]) => ({
      company_name,
      positions
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ ดึงรายงานการฝึกงานล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงรายงานการฝึกงาน' });
  }
});

// ✅ ดึงนิสิตที่ยืนยันฝึกงานแล้ว พร้อมบริษัท จังหวัด และอาจารย์ที่เคยเลือกไว้
router.get('/confirmed-students', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        s.student_id,
        s.student_name,
        s.age,
        s.profile_image,  
        s.gender,
        s.email,
        s.phone_number,
        c.company_name,
        j.address AS company_province,
        ss.supervisor_id,
        sup.supervisor_name
      FROM application a
      JOIN student s ON a.student_id = s.student_id
      JOIN job_posting j ON a.job_posting_id = j.job_posting_id
      JOIN company c ON j.company_id = c.company_id
      LEFT JOIN supervisor_selection ss ON s.student_id = ss.student_id
      LEFT JOIN supervisor sup ON ss.supervisor_id = sup.supervisor_id
      WHERE a.confirmed = 1`
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ ดึงข้อมูลนิสิตล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนิสิต' });
  }
});

// ✅ บันทึกการเลือกอาจารย์นิเทศลงตาราง supervisor_selection
router.post('/assign-instructor', async (req, res) => {
  const { student_id, supervisor_id } = req.body;

  console.log("📩 assign-instructor req.body:", req.body);
  if (!student_id || !supervisor_id) {
    return res.status(400).json({ message: 'กรุณาระบุ student_id และ supervisor_id' });
  }

  const selection_id = 'S' + Date.now();
  const today = new Date().toISOString().split('T')[0];

  try {
    const [check] = await db.promise().query(
      `SELECT * FROM supervisor_selection WHERE student_id = ?`,
      [student_id]
    );

    if (check.length > 0) {
      await db.promise().query(
        `UPDATE supervisor_selection 
         SET supervisor_id = ?, selection_date = ? 
         WHERE student_id = ?`,
        [supervisor_id, today, student_id]
      );
    } else {
      await db.promise().query(
        `INSERT INTO supervisor_selection 
         (selection_id, student_id, supervisor_id, selection_date)
         VALUES (?, ?, ?, ?)`,

        [selection_id, student_id, supervisor_id, today]
      );
    }

    res.json({ message: '✅ จับคู่อาจารย์นิเทศเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('❌ บันทึกการเลือกอาจารย์ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
});


// ✅ ดึงข้อมูลอาจารย์ประจำวิชา
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM instructor WHERE Instructor_id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูลอาจารย์' });
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ ดึงข้อมูลอาจารย์ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

module.exports = router;
