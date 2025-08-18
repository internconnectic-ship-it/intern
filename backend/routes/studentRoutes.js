const express = require('express');
const router = express.Router();
const db = require('../db');

/* =======================================================
   POST /student/profile → Insert หรือ Update อัตโนมัติ
======================================================= */
router.post('/profile', async (req, res) => {
  const {
    student_id, student_name, email, phone_number, major, faculty, university,
    gender, year_level, gpa, birth_date, age, special_skills, profile_image,
    intern_start_date, intern_end_date
  } = req.body;

  try {
    const [exists] = await db.promise().query(
      'SELECT * FROM student WHERE student_id = ?', [student_id]
    );

    if (exists.length > 0) {
      // 🔁 UPDATE
      await db.promise().query(
        `UPDATE student SET 
          student_name=?, email=?, phone_number=?, major=?, faculty=?, university=?, 
          gender=?, year_level=?, gpa=?, birth_date=?, age=?, special_skills=?, 
          profile_image=?, intern_start_date=?, intern_end_date=? 
        WHERE student_id=?`,
        [
          student_name, email, phone_number, major, faculty, university,
          gender, year_level, gpa, birth_date, age, special_skills,
          profile_image, intern_start_date, intern_end_date, student_id
        ]
      );
      return res.json({ message: '✅ อัปเดตข้อมูลเรียบร้อยแล้ว (/profile)' });
    } else {
      // ➕ INSERT
      await db.promise().query(
        `INSERT INTO student (
          student_id, student_name, email, phone_number, major, faculty, university,
          gender, year_level, gpa, birth_date, age, special_skills, profile_image, password,
          intern_start_date, intern_end_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          student_id, student_name, email, phone_number, major, faculty, university,
          gender, year_level, gpa, birth_date, age, special_skills, profile_image, '',
          intern_start_date, intern_end_date
        ]
      );
      return res.json({ message: '✅ เพิ่มข้อมูลนิสิตเรียบร้อยแล้ว' });
    }

  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาด:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', error: err.sqlMessage });
  }
});

/* =======================================================
   GET /student/status/history/:studentId
======================================================= */
router.get('/status/history/:studentId', async (req, res) => {
  const { studentId } = req.params;
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        a.apply_date, a.status, a.job_posting_id, a.confirmed,
        j.position, c.company_name
       FROM application a
       JOIN job_posting j ON a.job_posting_id = j.job_posting_id
       JOIN company c ON j.company_id = c.company_id
       WHERE a.student_id = ?
       ORDER BY a.apply_date DESC`,
      [studentId]
    );

    const statusMap = { 0: 'รอพิจารณา', 1: 'รับ', 2: 'ไม่รับ' };

    const result = rows.map(r => ({
      job_posting_id: r.job_posting_id,
      apply_date: r.apply_date,
      status: statusMap[r.status] || 'ไม่ทราบสถานะ',
      position: r.position,
      company_name: r.company_name,
      confirmed: r.confirmed || 0
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ ดึงสถานะผิดพลาด:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

/* =======================================================
   GET /student/by-supervisor/:supervisor_id
======================================================= */
router.get('/by-supervisor/:supervisor_id', async (req, res) => {
  const { supervisor_id } = req.params;
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        s.student_id, s.student_name, s.age, s.gender, s.phone_number,
        s.email, s.university, s.gpa, s.profile_image,
        c.company_name, c.province
      FROM supervisor_selection ss
      JOIN student s ON ss.student_id = s.student_id
      LEFT JOIN company c ON s.current_company_id = c.company_id
      WHERE ss.supervisor_id = ?`, [supervisor_id]);

    res.json(rows);
  } catch (err) {
    console.error("❌ ดึงนิสิตในความดูแลล้มเหลว:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนิสิต' });
  }
});

/* =======================================================
   GET /student/:id  (วางไว้ล่างสุดกันชน /profile)
======================================================= */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM student WHERE student_id = ?', [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนิสิต' });
  }
});

/* =======================================================
   PUT /student/:id
======================================================= */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    student_name, email, phone_number, major, faculty, university,
    gender, year_level, gpa, birth_date, age, special_skills, profile_image,
    intern_start_date, intern_end_date
  } = req.body;

  try {
    await db.promise().query(
      `UPDATE student SET 
        student_name=?, email=?, phone_number=?, major=?, faculty=?, university=?, 
        gender=?, year_level=?, gpa=?, birth_date=?, age=?, special_skills=?, 
        profile_image=?, intern_start_date=?, intern_end_date=?
      WHERE student_id=?`,
      [
        student_name, email, phone_number, major, faculty, university,
        gender, year_level, gpa, birth_date, age, special_skills,
        profile_image, intern_start_date, intern_end_date, id
      ]
    );
    res.json({ message: '✅ อัปเดตข้อมูลเรียบร้อยแล้ว' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลนิสิต' });
  }
});

module.exports = router;
