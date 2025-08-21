const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Helper: แปลงคะแนนบริษัท (0–120) เป็นเปอร์เซ็นต์ (0–100)
 */
const companyToPct = (raw120) => {
  const v = parseFloat(raw120 ?? 0);
  if (Number.isNaN(v) || v < 0) return 0;
  return Math.min(100, (v / 120) * 100);
};

/**
 * Helper: Clamp คะแนนอาจารย์ (0–100)
 */
const clampSupervisor = (v) => {
  const n = parseFloat(v ?? 0);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(100, n);
};

// ✅ POST: บันทึกผลการประเมิน (เก็บดิบเหมือนเดิม + คิดผลรวมแบบใหม่)
router.post('/submit', async (req, res) => {
  const {
    student_id,
    supervisor_id,
    company_id,
    instructor_id,
    score_quality,
    score_behavior,
    score_skill,
    score_presentation,
    score_content,
    score_answer,
    supervisor_comment,
    company_comment,
    evaluation_date,
    role,
    company_score // ถ้าบริษัทส่งผลรวมมา (เต็ม 120)
  } = req.body;

  let supervisor_score = null; // 0–100
  let company_raw = null;      // 0–120 (เก็บดิบในตาราง)

  const today = evaluation_date || new Date().toISOString().split('T')[0];

  if (role === 'supervisor') {
    // รวมเต็ม 100 (20+20+10+20+20+10)
    supervisor_score =
      parseFloat(score_quality || 0) +
      parseFloat(score_behavior || 0) +
      parseFloat(score_skill || 0) +
      parseFloat(score_presentation || 0) +
      parseFloat(score_content || 0) +
      parseFloat(score_answer || 0);
    supervisor_score = clampSupervisor(supervisor_score);
  } else if (role === 'company') {
    // รับคะแนนดิบเต็ม 120 (อาจมาจาก req.body.company_score)
    company_raw = parseFloat(company_score ?? req.body.company_score ?? 0);
    if (Number.isNaN(company_raw) || company_raw < 0) company_raw = 0;
    if (company_raw > 120) company_raw = 120;
  }

  console.log("POST /submit payload:", req.body); // log ข้อมูลที่รับเข้ามา

  try {
    const [existing] = await db.promise().query(
      `SELECT * FROM evaluation WHERE student_id = ?`,
      [student_id]
    );

    if (existing.length > 0) {
      let query = `UPDATE evaluation SET `;
      const params = [];

      if (role === 'supervisor') {
        query += `
          supervisor_score = ?, 
          supervisor_comment = ?, 
          supervisor_id = ?, 
          instructor_id = ?, 
          supervisor_evaluation_date = ?
        `;
        params.push(
          supervisor_score,
          supervisor_comment || null,
          supervisor_id || null,
          instructor_id || null,
          today
        );
      } else if (role === 'company') {
        query += `
          company_score = ?, 
          company_comment = ?, 
          company_id = ?, 
          company_evaluation_date = ?
        `;
        params.push(
          company_raw,
          company_comment || null,
          company_id || null,
          today
        );
      }

      query += ` WHERE student_id = ?`;
      params.push(student_id);
      await db.promise().query(query, params);
    } else {
      await db.promise().query(
        `INSERT INTO evaluation (
          student_id, supervisor_id, company_id, instructor_id,
          supervisor_score, company_score,
          supervisor_comment, company_comment,
          evaluation_result, supervisor_evaluation_date, company_evaluation_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          student_id,
          supervisor_id || null,
          company_id || null,
          instructor_id || null,
          role === 'supervisor' ? supervisor_score : null,
          role === 'company' ? company_raw : null,
          supervisor_comment || null,
          company_comment || null,
          0, // ค่าเริ่มต้น (ยังไม่ตัดสิน)
          role === 'supervisor' ? today : null,
          role === 'company' ? today : null
        ]
      );
    }

    // ✅ หลังบันทึก: ดึงคะแนนล่าสุดมา "คำนวณแบบใหม่" และอัปเดต evaluation_result เมื่อมีครบสองฝั่ง
const [rows] = await db.promise().query(
  `SELECT supervisor_score, company_score FROM evaluation WHERE student_id = ?`,
  [student_id]
);

if (rows.length > 0) {
  const sup = rows[0].supervisor_score;   // 0–100
  const compRaw = rows[0].company_score;  // 0–120

  if (sup != null && compRaw != null) {
    const compPct = companyToPct(compRaw);
    const supPct  = clampSupervisor(sup);

    // ถ่วงน้ำหนัก: บริษัท 60% + อาจารย์ 40%
    const finalScore = (compPct * 0.60) + (supPct * 0.40);

    let result = 0; // default = pending
    if (finalScore >= 70) {
      result = 1; // ผ่าน
    } else {
      result = 2; // ไม่ผ่าน
    }

    await db.promise().query(
      `UPDATE evaluation SET evaluation_result = ? WHERE student_id = ?`,
      [result, student_id]
    );
  }
}


    res.status(200).json({ message: '✅ บันทึกผลการประเมินสำเร็จ' });
  } catch (err) {
    console.error('❌ บันทึกผลการประเมินล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกผล' });
  }
});

// ✅ GET: รายชื่อนิสิตที่อาจารย์นิเทศเลือก
router.get('/students/:supervisor_id', async (req, res) => {
  const { supervisor_id } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT 
         s.student_id,
         s.student_name,
         s.email,
         s.age,
         s.phone_number,
         s.university,
         s.profile_image,
         COALESCE(e.supervisor_score, NULL) AS evaluation_score,
         CASE 
           WHEN e.supervisor_score IS NOT NULL THEN 'completed'
           ELSE 'pending'
         END AS evaluation_status
       FROM supervisor_selection ss
       JOIN student s ON ss.student_id = s.student_id
       LEFT JOIN evaluation e ON s.student_id = e.student_id
       WHERE ss.supervisor_id = ?`,
      [supervisor_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('❌ ดึงรายชื่อนิสิตล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงรายชื่อนิสิต' });
  }
});

// ✅ GET: รายชื่อนิสิตของบริษัท
router.get('/company/students/:company_id', async (req, res) => {
  const { company_id } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT 
         s.student_id,
         s.student_name,
         s.email,
         s.age,
         s.phone_number,
         s.university,
         s.profile_image,
         COALESCE(e.company_score, NULL) AS evaluation_score,
         CASE 
           WHEN e.company_score IS NOT NULL THEN 'completed'
           ELSE 'pending'
         END AS evaluation_status
       FROM internship i
       JOIN student s ON i.student_id = s.student_id
       LEFT JOIN evaluation e ON s.student_id = e.student_id
       WHERE i.company_id = ?`,
      [company_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('❌ ดึงรายชื่อนิสิตของบริษัทล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงรายชื่อนิสิต' });
  }
});

// ✅ GET: รวมผลการประเมินแบบคำนวณใหม่ (มี final_score / final_status)
router.get('/all', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        e.evaluation_id,
        e.student_id,
        s.student_name,
        s.profile_image,
        s.intern_start_date,
        s.intern_end_date,
        e.supervisor_score,                        -- 0–100
        e.company_score,                           -- ดิบ 0–120
        -- บริษัทเป็นเปอร์เซ็นต์ (0–100)
        LEAST((e.company_score / 120) * 100, 100) AS company_score_pct,
        -- คะแนนรวมถ่วงน้ำหนัก 60/40 (0–100) เมื่อมีครบสองฝั่ง
        CASE 
          WHEN e.company_score IS NOT NULL AND e.supervisor_score IS NOT NULL
            THEN (LEAST((e.company_score / 120) * 100, 100) * 0.60) 
               + (LEAST(e.supervisor_score, 100) * 0.40)
          ELSE NULL
        END AS final_score,
        -- สถานะ: pass/fail/pending
        CASE 
          WHEN e.company_score IS NOT NULL AND e.supervisor_score IS NOT NULL
               AND (
                 (LEAST((e.company_score / 120) * 100, 100) * 0.60)
               + (LEAST(e.supervisor_score, 100) * 0.40)
               ) >= 70
            THEN 'pass'
          WHEN e.company_score IS NOT NULL AND e.supervisor_score IS NOT NULL
            THEN 'fail'
          ELSE 'pending'
        END AS final_status,
        e.evaluation_result,                       -- 1/0 (ที่อัปเดตตอน submit)
        sup.supervisor_name,
        c.company_name
      FROM evaluation e
      JOIN student s ON e.student_id = s.student_id
      LEFT JOIN supervisor sup ON e.supervisor_id = sup.supervisor_id
      LEFT JOIN company c ON e.company_id = c.company_id
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ ดึงข้อมูลการประเมินล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' });
  }
});



// ✅ PUT: อัปเดตผลการประเมิน (ให้สิทธิ์อาจารย์เซ็ตผลรวม/แก้ไข)
router.put('/:evaluation_id', async (req, res) => {
  const { evaluation_id } = req.params;
  const { evaluation_result, instructor_id } = req.body;

  try {
    await db.promise().query(
      `UPDATE evaluation 
       SET evaluation_result = ?, instructor_id = ?
       WHERE evaluation_id = ?`,
      [evaluation_result, instructor_id || null, evaluation_id]
    );
    res.json({ message: '✅ อัปเดตผลการประเมินสำเร็จ' });
  } catch (err) {
    console.error('❌ อัปเดตผลการประเมินล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตผล' });
  }
});

// ✅ GET: รายละเอียดการประเมินของนิสิต (อาจารย์นิเทศ)
router.get('/supervisor-details/:student_id', async (req, res) => {
  const { student_id } = req.params;
  console.log("GET /supervisor-details/", student_id); // log student_id
  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM evaluation_supervisor_details WHERE student_id = ?`,
      [student_id]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลการประเมินอาจารย์นิเทศของนิสิตนี้' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ ดึงข้อมูล supervisor details ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// ✅ GET: รายละเอียดการประเมินของนิสิต (บริษัท)
router.get('/company-details/:student_id', async (req, res) => {
  const { student_id } = req.params;
  console.log("GET /company-details/", student_id); // log student_id
  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM evaluation_company_details WHERE student_id = ?`,
      [student_id]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลการประเมินบริษัทของนิสิตนี้' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ ดึงข้อมูล company details ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

module.exports = router;
