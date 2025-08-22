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

router.get('/all', async (req, res) => {
  try {
    console.log("🔥 เรียก /api/evaluation/all แล้ว");
    const [rows] = await db.promise().query(`
      SELECT 
        e.evaluation_id,
        e.student_id,
        s.student_name,
        s.profile_image,
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

    console.log("📌 Raw query result:", rows);
     res.json(rows);   // ❗ ต้องเป็น rows ไม่ใช่ null
  } catch (err) {
    console.error("❌ Error fetching evaluations:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST: บันทึกผลการประเมิน (รวม + details)
router.post('/submit', async (req, res) => {
  console.log("📦 req.body =", req.body);
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
    company_score,
    // 🟦 ฟิลด์ดิบของบริษัท
    p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,
    w1,w2,w3,w4,w5,w6,w7,w8,w9,w10,
    absent_sick, absent_personal, late_days, absent_uninformed
  } = req.body;

  let supervisor_score = null; // 0–100
  let company_raw = null;      // 0–120
  const today = evaluation_date || new Date().toISOString().split('T')[0];

  // ✅ คำนวณคะแนนรวมฝั่ง supervisor
  if (role === 'supervisor') {
    supervisor_score =
      parseFloat(score_quality || 0) +
      parseFloat(score_behavior || 0) +
      parseFloat(score_skill || 0) +
      parseFloat(score_presentation || 0) +
      parseFloat(score_content || 0) +
      parseFloat(score_answer || 0);
    supervisor_score = clampSupervisor(supervisor_score);
  }

  // ✅ คำนวณคะแนนรวมฝั่ง company
  if (role === 'company') {
    company_raw = parseFloat(company_score ?? 0);
    if (Number.isNaN(company_raw) || company_raw < 0) company_raw = 0;
    if (company_raw > 120) company_raw = 120;
    
  }

  try {
    // 🔹 1) insert/update evaluation (ตารางหลัก)
    const [existing] = await db.promise().query(
      `SELECT * FROM evaluation WHERE student_id = ?`,
      [student_id]
    );

    if (existing.length > 0) {
      // update
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
        params.push(supervisor_score, supervisor_comment || null, supervisor_id || null, instructor_id || null, today);
      }

      if (role === 'company') {
        query += `
          company_score = ?, 
          company_comment = ?, 
          company_id = ?, 
          company_evaluation_date = ?
        `;
        params.push(company_raw, company_comment || null, company_id || null, today);
      }

      query += ` WHERE student_id = ?`;
      params.push(student_id);
      await db.promise().query(query, params);
    } else {
      // insert
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
          0,
          role === 'supervisor' ? today : null,
          role === 'company' ? today : null
        ]
      );
    }

    // 🔹 2) หา evaluation_id
    const [rowEval] = await db.promise().query(
      "SELECT evaluation_id FROM evaluation WHERE student_id = ?",
      [student_id]
    );
    const evaluation_id = rowEval[0].evaluation_id;
    //console.log("📦 req.body =", req.body);
    // 🔹 3) insert/update details ตาม role
    if (role === 'company') {
      await db.promise().query(`
        INSERT INTO evaluation_company_details (
          evaluation_id, student_id, company_id,
          p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,
          w1,w2,w3,w4,w5,w6,w7,w8,w9,w10,
          absent_sick, absent_personal, late_days, absent_uninformed, company_comment
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          p1=VALUES(p1), p2=VALUES(p2), p3=VALUES(p3), p4=VALUES(p4), p5=VALUES(p5),
          p6=VALUES(p6), p7=VALUES(p7), p8=VALUES(p8), p9=VALUES(p9), p10=VALUES(p10),
          w1=VALUES(w1), w2=VALUES(w2), w3=VALUES(w3), w4=VALUES(w4), w5=VALUES(w5),
          w6=VALUES(w6), w7=VALUES(w7), w8=VALUES(w8), w9=VALUES(w9), w10=VALUES(w10),
          absent_sick=VALUES(absent_sick),
          absent_personal=VALUES(absent_personal),
          late_days=VALUES(late_days),
          absent_uninformed=VALUES(absent_uninformed),
          company_comment=VALUES(company_comment)
      `, [
        evaluation_id, student_id, company_id,
        p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,
        w1,w2,w3,w4,w5,w6,w7,w8,w9,w10,
        absent_sick, absent_personal, late_days, absent_uninformed,
        company_comment
      ]);
    }

    if (role === 'supervisor') {
      await db.promise().query(`
        INSERT INTO evaluation_supervisor_details (
          evaluation_id, student_id, supervisor_id, instructor_id,
          score_quality, score_behavior, score_skill,
          score_personality, score_content, score_qna, supervisor_comment
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          score_quality=VALUES(score_quality),
          score_behavior=VALUES(score_behavior),
          score_skill=VALUES(score_skill),
          score_personality=VALUES(score_personality),
          score_content=VALUES(score_content),
          score_qna=VALUES(score_qna),
          supervisor_comment=VALUES(supervisor_comment)
      `, [
        evaluation_id, student_id, supervisor_id, instructor_id,
        score_quality, score_behavior, score_skill,
        score_presentation, score_content, score_answer,
        supervisor_comment
      ]);
    }

    // 🔹 4) คำนวณผลรวมใหม่
    const [rows] = await db.promise().query(
      `SELECT supervisor_score, company_score FROM evaluation WHERE student_id = ?`,
      [student_id]
    );

    if (rows.length > 0) {
      const sup = rows[0].supervisor_score;
      const compRaw = rows[0].company_score;
      if (sup != null && compRaw != null) {
        const compPct = companyToPct(compRaw);
        const supPct  = clampSupervisor(sup);
        const finalScore = (compPct * 0.60) + (supPct * 0.40);

        let result = 0;
        if (finalScore >= 70) result = 1;
        else result = 2;

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

// ✅ GET: ดึงข้อมูลการประเมินของนักศึกษา (รวม + details)
router.get('/:student_id', async (req, res) => {
  const { student_id } = req.params;
  const { role } = req.query;

  try {
    let query;
    if (role === 'company') {
      query = `
        SELECT e.*, d.* 
        FROM evaluation e
        LEFT JOIN evaluation_company_details d ON e.evaluation_id = d.evaluation_id
        WHERE e.student_id = ?`;
    } else if (role === 'supervisor') {
      query = `
        SELECT e.*, d.* 
        FROM evaluation e
        LEFT JOIN evaluation_supervisor_details d ON e.evaluation_id = d.evaluation_id
        WHERE e.student_id = ?`;
    } else {
      query = `SELECT * FROM evaluation WHERE student_id = ?`;
    }

    const [rows] = await db.promise().query(query, [student_id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error('❌ ดึงข้อมูลการประเมินล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// ✅ GET: ดึงข้อมูลคะแนนดิบจาก evaluation_company_details
router.get('/company-details/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM evaluation_company_details WHERE student_id = ?`,
      [student_id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error('❌ ดึงข้อมูล company details ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// ✅ GET: ดึงข้อมูลคะแนนดิบจาก evaluation_supervisor_details
router.get('/supervisor-details/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM evaluation_supervisor_details WHERE student_id = ?`,
      [student_id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error('❌ ดึงข้อมูล supervisor details ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// ✅ GET: รายชื่อนิสิตของบริษัท (สำหรับหน้า DashboardCompanyEvaluation)
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

// ✅ GET: รายชื่อนิสิตของ supervisor (สำหรับหน้า DashboardSupervisorEvaluation)
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

//ดึงข้อมูลเดิมมาแสดงในฟอร์ม
router.get('/details/:student_id/:role', async (req, res) => {
  const { student_id, role } = req.params;

  try {
    // 1) ดึงข้อมูลจากตารางหลักก่อน
    const [evaluationRows] = await db.promise().query(
      `SELECT * FROM evaluation WHERE student_id = ?`,
      [student_id]
    );

    if (evaluationRows.length === 0) {
      return res.json({ message: "ยังไม่มีข้อมูลการประเมิน", data: null });
    }

    const evaluation = evaluationRows[0];
    let details = null;

    // 2) ถ้า role เป็น company → ดึงรายละเอียดจาก evaluation_company_details
    if (role === "company") {
      const [rows] = await db.promise().query(
        `SELECT * FROM evaluation_company_details 
         WHERE evaluation_id = ? AND student_id = ? AND company_id = ?`,
        [evaluation.evaluation_id, student_id, evaluation.company_id]
      );
      details = rows.length > 0 ? rows[0] : null;
    }

    // 3) ถ้า role เป็น supervisor → ดึงรายละเอียดจาก evaluation_supervisor_details
    if (role === "supervisor") {
      const [rows] = await db.promise().query(
        `SELECT * FROM evaluation_supervisor_details 
         WHERE evaluation_id = ? AND student_id = ? AND supervisor_id = ?`,
        [evaluation.evaluation_id, student_id, evaluation.supervisor_id]
      );
      details = rows.length > 0 ? rows[0] : null;
    }

    res.json({ message: "✅ ดึงข้อมูลสำเร็จ", evaluation, details });
  } catch (err) {
    console.error("❌ GET /details error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// routes/evaluationRoutes.js


module.exports = router;
