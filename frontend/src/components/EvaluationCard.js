import React from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const EvaluationCard = ({ student = {} }) => {
  const navigate = useNavigate();

  const {
    student_id,
    student_name = '-',
    profile_image,
    supervisor_name = '-',
    company_name = '-',
    supervisor_score: supRaw,   // 0–100
    company_score: compRaw,     // ดิบ 0–120
    company_score_pct,
    final_score,
    // 🆕 ฟิลด์ใหม่จากตาราง internship
    start_date,
    end_date,
  } = student || {};

  // --- Helpers ---
  const toNum = (v) => (v === null || v === undefined || isNaN(Number(v)) ? null : Number(v));
  const clamp = (v, min, max) => (v == null ? null : Math.max(min, Math.min(max, v)));
  const fmt = (v, d = 1) => (v == null || Number.isNaN(+v) ? '-' : Number(v).toFixed(d));
  const fmtDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
  };

  // --- Normalize values ---
  const sup = clamp(toNum(supRaw), 0, 100);
  const comp120 = clamp(toNum(compRaw), 0, 120);
  const compPct =
    toNum(company_score_pct) != null
      ? clamp(Number(company_score_pct), 0, 100)
      : comp120 != null
      ? (comp120 / 120) * 100
      : null;

  const bothProvided = (sup != null && sup > 0) && (comp120 != null && comp120 > 0);

  const computedFinal = (sup != null && compPct != null)
    ? compPct * 0.6 + sup * 0.4
    : null;

  const fScore = (bothProvided && toNum(final_score) != null)
    ? Number(final_score)
    : (bothProvided ? computedFinal : null);

  // --- Status ---
  let status = 'pending';
  if (bothProvided) status = (fScore >= 70 ? 'pass' : 'fail');

  const badge = {
    pass:   { text: 'ผ่าน',        cls: 'bg-green-500 text-white' },
    fail:   { text: 'ไม่ผ่าน',     cls: 'bg-red-500 text-white' },
    pending:{ text: 'รอคะแนนครบ', cls: 'bg-gray-400 text-white' },
  }[status];

  const handleDetailClick = () => {
    navigate(`/student-detail/${student_id}`);
  };

  const imgSrc = profile_image; 

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-5 mb-5 flex flex-col md:flex-row md:items-center gap-6 text-black">
      <div className="flex gap-5 items-start">
        <img
          src={imgSrc}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-300"
        />
        <div>
          <h3 className="font-semibold text-xl">{student_name}</h3>

          <button
            onClick={handleDetailClick}
            className="text-blue-600 text-sm underline hover:text-blue-800"
          >
            ดูข้อมูลเพิ่มเติม
          </button>

          <div className="mt-3 space-y-1">
            <p>อาจารย์นิเทศ 40% : {supervisor_name}</p>
            <p>คะแนนที่ได้ : {fmt(sup, 0)} / 100 คะแนน</p>
            <p className="mt-2">สถานประกอบการ 60% : {company_name}</p>
            <p>คะแนนที่ได้ : {fmt(comp120, 0)} / 120 คะแนน</p>

            {/* 🆕 แสดงช่วงเวลาฝึกงาน */}
            <p className="mt-2">วันที่เริ่มฝึกงาน: {fmtDate(start_date)}</p>
            <p>วันที่สิ้นสุดฝึกงาน: {fmtDate(end_date)}</p>

            <p className="mt-2 font-medium">
              สรุปรวม (เกณฑ์ผ่าน ≥ 70%) : {fScore == null ? '-' : `${fmt(fScore, 1)}%`} 
            </p>
          </div>
        </div>
      </div>

      <div className="ml-auto">
        <span className={`px-4 py-2 rounded font-medium ${badge.cls}`}>
          {badge.text}
        </span>
      </div>
    </div>
  );
};

export default EvaluationCard;
