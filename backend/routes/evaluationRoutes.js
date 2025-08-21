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

// ✅ POST: บันทึกผลการประเมิน (รวม + details)
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
    company_score,
    // 🟦 ฟิลด์ดิบของบริษัท
    p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,
    w1,w2,w3,w4,w5,w6,w7,w8,w9,w10,
    absent_sick, absent_personal, late_days, absent_uninformed
  } = req.body;

  let supervisor_score = null; // 0–100
  let company_raw = null;      // 0–120

  const today = evaluation_date || new Date().toISOString().split('T')[0];

  if (role === 'supervisor') {
    supervisor_score =
      parseFloat(score_quality || 0) +
      parseFloat(score_behavior || 0) +
      parseFloat(score_skill || 0) +
      parseFloat(score_presentation || 0) +
      parseFloat(score_content || 0) +
      parseFloat(score_answer || 0);
    supervisor_score = clampSupervisor(supervisor_score);
  } else if (role === 'company') {
    company_raw = parseFloat(company_score ?? 0);
    if (Number.isNaN(company_raw) || company_raw < 0) company_raw = 0;
    if (company_raw > 120) company_raw = 120;
  }

  try {
    // 🔹 1) insert/update evaluation
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

    // 🔹 3) insert/update details
    if (role === 'company') {
      await db.promise().query(`
        INSERT INTO evaluation_company_details (
          evaluation_id, student_id, company_id,
          p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,
          w1,w2,w3,w4,w5,w6,w7,w8,w9,w10,
          absent_sick, absent_personal, late_days, absent_uninformed, comment
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          p1=VALUES(p1), p2=VALUES(p2), p3=VALUES(p3), p4=VALUES(p4), p5=VALUES(p5),
          p6=VALUES(p6), p7=VALUES(p7), p8=VALUES(p8), p9=VALUES(p9), p10=VALUES(p10),
          w1=VALUES(w1), w2=VALUES(w2), w3=VALUES(w3), w4=VALUES(w4), w5=VALUES(w5),
          w6=VALUES(w6), w7=VALUES(w7), w8=VALUES(w8), w9=VALUES(w9), w10=VALUES(w10),
          absent_sick=VALUES(absent_sick),
          absent_personal=VALUES(absent_personal),
          late_days=VALUES(late_days),
          absent_uninformed=VALUES(absent_uninformed),
          comment=VALUES(comment)
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
          score_personality, score_content, score_qna, comment
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          score_quality=VALUES(score_quality),
          score_behavior=VALUES(score_behavior),
          score_skill=VALUES(score_skill),
          score_personality=VALUES(score_personality),
          score_content=VALUES(score_content),
          score_qna=VALUES(score_qna),
          comment=VALUES(comment)
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

module.exports = router;
