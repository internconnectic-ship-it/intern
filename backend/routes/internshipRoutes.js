const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔐 POST: ยืนยันการฝึกงาน
router.post('/confirm', async (req, res) => {
  const { student_id, job_posting_id } = req.body;

  console.log("📩 รับคำขอยืนยันฝึกงาน:", { student_id, job_posting_id });

  try {
    const [jobRows] = await db.promise().query(
      `SELECT * FROM job_posting WHERE job_posting_id = ?`,
      [job_posting_id]
    );

    if (jobRows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบประกาศงานนี้' });
    }

    const job = jobRows[0];

    const [check] = await db.promise().query(
      `SELECT * FROM internship WHERE student_id = ?`,
      [student_id]
    );

    if (check.length > 0) {
      return res.status(400).json({ message: 'คุณได้ยืนยันฝึกงานแล้ว' });
    }

    const [studentRows] = await db.promise().query(
      `SELECT intern_start_date, intern_end_date FROM student WHERE student_id = ?`,
      [student_id.trim()]
    );

    console.log("📩 รับคำขอยืนยันฝึกงาน:", req.body);
    console.log("🔍 student_id แบบละเอียด:", JSON.stringify(student_id));
    console.log("📅 studentRows:", studentRows);
    console.log("🧪 intern_start_date:", studentRows[0]?.intern_start_date);
    console.log("🧪 intern_end_date:", studentRows[0]?.intern_end_date);

    if (studentRows.length === 0) {
      console.log("❌ ไม่พบ studentRows");
      return res.status(400).json({ message: 'ไม่พบนิสิต' });
    }

    if (!studentRows[0].intern_start_date || !studentRows[0].intern_end_date) {
      console.log("❌ วันที่ฝึกงานว่าง");
      return res.status(400).json({ message: 'กรุณากรอกช่วงเวลาฝึกงานในโปรไฟล์ก่อนยืนยัน' });
    }

    const startDate = studentRows[0].intern_start_date;
    const endDate = studentRows[0].intern_end_date;

    //const internship_id = `I${Date.now()}`;
    await db.promise().query(
      `INSERT INTO internship (
        student_id, company_id, internship_position,
        start_date, end_date, compensation, job_description
      ) VALUES ( ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        job.company_id,
        job.position,
        startDate,
        endDate,
        job.compensation,
        job.job_description
      ]
    );

    await db.promise().query(
      `UPDATE application SET confirmed = 1 WHERE student_id = ? AND job_posting_id = ?`,
      [student_id, job_posting_id]
    );

    return res.status(200).json({ message: '✅ ยืนยันฝึกงานสำเร็จ' }); // ✅ เพิ่ม return
  } catch (err) {
    console.error("❌ ERROR ยืนยันฝึกงาน:", err);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยืนยันฝึกงาน' });
  }
});

module.exports = router;
