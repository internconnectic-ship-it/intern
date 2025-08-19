const express = require('express');
const router = express.Router();
const db = require('../db');

// ⚡ Helper แปลงวันที่เป็น YYYY-MM-DD
function formatDate(dateString) {
  if (!dateString) return null;
  return dateString.split('T')[0]; // ตัดเวลาออก
}

// 🔍 ดึงข้อมูลนิสิต
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query('SELECT * FROM student WHERE student_id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนิสิต' });
  }
});

// ✏️ แก้ไขข้อมูลนิสิต
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    student_name, email, phone_number, major, faculty, university,
    gender, year_level, gpa, birth_date, age, special_skills, profile_image,
    intern_start_date, intern_end_date
  } = req.body;

  try {
    console.log("📸 profile_image ที่ได้รับ:", profile_image);

    const birthDate = formatDate(birth_date);
    const startDate = formatDate(intern_start_date);
    const endDate = formatDate(intern_end_date);

    // ❌ ไม่ต้องใส่ path แล้ว ให้เก็บแค่ชื่อไฟล์
    const imageToSave = profile_image || null;

    await db.promise().query(
      `UPDATE student SET 
        student_name = ?, email = ?, phone_number = ?, major = ?, faculty = ?, university = ?, 
        gender = ?, year_level = ?, gpa = ?, birth_date = ?, age = ?, special_skills = ?, 
        profile_image = ?, intern_start_date = ?, intern_end_date = ?
      WHERE student_id = ?`,
      [
        student_name, email, phone_number, major, faculty, university,
        gender, year_level, gpa, birthDate, age, special_skills,
        imageToSave, startDate, endDate, id
      ]
    );
    res.json({ message: '✅ อัปเดตข้อมูลเรียบร้อยแล้ว' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลนิสิต' });
  }
});



// ✅ POST /student/profile → Insert หรือ Update อัตโนมัติ
router.post('/profile', async (req, res) => {
  const {
    student_id, student_name, email, phone_number, major, faculty, university,
    gender, year_level, gpa, birth_date, age, special_skills, profile_image,
    intern_start_date, intern_end_date
  } = req.body;

  try {
    const birthDate = formatDate(birth_date);
    const startDate = formatDate(intern_start_date);
    const endDate = formatDate(intern_end_date);

    const [exists] = await db.promise().query(
      'SELECT * FROM student WHERE student_id = ?', [student_id]
    );

    if (exists.length > 0) {
      // 🔁 UPDATE
      await db.promise().query(
        `UPDATE student SET 
          student_name = ?, email = ?, phone_number = ?, major = ?, faculty = ?, university = ?, 
          gender = ?, year_level = ?, gpa = ?, birth_date = ?, age = ?, special_skills = ?, 
          profile_image = ?, intern_start_date = ?, intern_end_date = ?
        WHERE student_id = ?`,
        [
          student_name, email, phone_number, major, faculty, university,
          gender, year_level, gpa, birthDate, age, special_skills,
          profile_image, startDate, endDate, student_id
        ]
      );
      return res.json({ message: '✅ อัปเดตข้อมูลเรียบร้อยแล้ว (จาก /profile)' });
    } else {
      // ➕ INSERT
      await db.promise().query(
        `INSERT INTO student (
          student_id, student_name, email, phone_number, major, faculty, university,
          gender, year_level, gpa, birth_date, age, special_skills, profile_image, password,
          intern_start_date, intern_end_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
          student_name = VALUES(student_name),
          email = VALUES(email),
          phone_number = VALUES(phone_number),
          major = VALUES(major),
          faculty = VALUES(faculty),
          university = VALUES(university),
          gender = VALUES(gender),
          year_level = VALUES(year_level),
          gpa = VALUES(gpa),
          birth_date = VALUES(birth_date),
          age = VALUES(age),
          special_skills = VALUES(special_skills),
          profile_image = VALUES(profile_image),
          intern_start_date = VALUES(intern_start_date),
          intern_end_date = VALUES(intern_end_date)
        `,
        [
          student_id, student_name, email, phone_number, major, faculty, university,
          gender, year_level, gpa, birthDate, age, special_skills, profile_image, '',
          startDate, endDate
        ]
      );
      return res.json({ message: '✅ เพิ่มข้อมูลนิสิตเรียบร้อยแล้ว' });
    }

  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาด:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', error: err.sqlMessage });
  }
});

// ✅ ดึงประวัติการสมัครงาน
router.get('/status/history/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT 
        a.apply_date, 
        a.status, 
        a.job_posting_id, 
        a.confirmed,              
        j.position, 
        c.company_name
       FROM application a
       JOIN job_posting j ON a.job_posting_id = j.job_posting_id
       JOIN company c ON j.company_id = c.company_id
       WHERE a.student_id = ?
       ORDER BY a.apply_date DESC`,
      [studentId]
    );

    const statusMap = {
      0: 'รอพิจารณา',
      1: 'รับ',
      2: 'ไม่รับ'
    };

    const result = rows.map(row => ({
      job_posting_id: row.job_posting_id,
      apply_date: row.apply_date,
      status: statusMap[row.status] || 'ไม่ทราบสถานะ',
      position: row.position,
      company_name: row.company_name,
      confirmed: row.confirmed || 0
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ ดึงสถานะผิดพลาด:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// ✅ ดึงนิสิตที่จับคู่กับอาจารย์นิเทศ พร้อมชื่อบริษัท จังหวัด
router.get('/by-supervisor/:supervisor_id', async (req, res) => {
  const { supervisor_id } = req.params;

  try {
    const [rows] = await db.promise().query(`
      SELECT 
        s.student_id, s.student_name, s.age, s.gender, s.phone_number,
        s.email, s.university, s.gpa, s.profile_image,
        c.company_name,
        c.province
      FROM supervisor_selection ss
      JOIN student s ON ss.student_id = s.student_id
      LEFT JOIN company c ON s.current_company_id = c.company_id
      WHERE ss.supervisor_id = ?`, 
      [supervisor_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ ดึงนิสิตในความดูแลล้มเหลว:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนิสิต' });
  }
});

module.exports = router;
