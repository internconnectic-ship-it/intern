// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/summary', async (req, res) => {
  try {
    const [[students]] = await db.promise().query(
      'SELECT COUNT(*) AS count FROM student'
    );
    const [[companies]] = await db.promise().query(
      'SELECT COUNT(*) AS count FROM company'
    );

    // ✅ นับตามค่าที่เก็บใน student.evaluation_result
    const [[passed]] = await db.promise().query(
      'SELECT COUNT(*) AS count FROM student WHERE evaluation_result = 1'
    );
    const [[failed]] = await db.promise().query(
      'SELECT COUNT(*) AS count FROM student WHERE evaluation_result = 2'
    );
    const [[pending]] = await db.promise().query(
      'SELECT COUNT(*) AS count FROM student WHERE evaluation_result = 0'
    );

    res.json({
      studentCount: students.count,
      companyCount: companies.count,
      passedCount: passed.count,
      failedCount: failed.count,
      pendingCount: pending.count, 
    });
  } catch (err) {
    console.error("❌ summary error:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด summary', error: err });
  }
});


router.get('/top-companies', async (req, res) => {
  const [rows] = await db.promise().query(`
    SELECT c.company_name AS label, COUNT(*) AS count
    FROM internship i
    JOIN company c ON i.company_id = c.company_id
    GROUP BY i.company_id
    ORDER BY count DESC
    LIMIT 5
  `);
  res.json(rows);
});

// จังหวัดที่มีสถานประกอบการมากที่สุด (จาก job_posting)
router.get('/top-provinces', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        address AS label,
        COUNT(*) AS count
      FROM job_posting
      WHERE address IS NOT NULL AND address != ''
      GROUP BY address
      ORDER BY count DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ top-provinces error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลจังหวัด', error: err });
  }
});




module.exports = router;
