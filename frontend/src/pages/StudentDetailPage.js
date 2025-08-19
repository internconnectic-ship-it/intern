// src/pages/StudentDetailPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const buildImageUrl = (val) => {
  if (!val) return null;
  if (/^https?:\/\//i.test(val)) return val;
  const file = String(val).split(/[/\\]/).pop();
  return `${API_URL}/uploads/profile/${encodeURIComponent(file)}`;
};
const fmt = (d) => (d ? String(d).split('T')[0] : '-');

const PlaceholderAvatar = ({ name }) => {
  const initials = useMemo(
    () =>
      (name || '?')
        .split(' ')
        .map((w) => w[0]?.toUpperCase())
        .slice(0, 2)
        .join(''),
    [name]
  );
  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold"
      style={{ backgroundColor: '#4691D3' }}
    >
      {initials || 'S'}
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="space-y-0.5">
    <div className="text-xs text-[#465d71]">{label}</div>
    <div className="text-[#130347] font-medium">{value || '-'}</div>
  </div>
);

export default function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/student/${id}`);
        setStudent(res.data || {});
      } catch (e) {
        console.error('❌ ดึงข้อมูลนิสิตผิดพลาด:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#9AE5F2]">
      <Header />

      <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-8">
        {/* หัวเรื่อง */}
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-[#130347]">👤 รายละเอียดนิสิต</h1>
          <p className="text-sm text-[#465d71]">ข้อมูลติดต่อ การศึกษา และช่วงเวลาฝึกงาน</p>
        </div>

        {/* เนื้อหา */}
        <div className="bg-white border border-[#E6F0FF] rounded-2xl shadow-sm p-6">
          {loading ? (
            <div className="text-[#465d71]">กำลังโหลดข้อมูล…</div>
          ) : !student ? (
            <div className="text-[#465d71]">ไม่พบนิสิตที่ระบุ</div>
          ) : (
            <>
              {/* หัวการ์ดเรียบๆ */}
              <div className="flex items-center gap-4 mb-6">
                {student.profile_image ? (
                  <img
                    src={buildImageUrl(student.profile_image)}
                    alt="profile"
                    className="w-20 h-20 rounded-full object-cover border border-[#E6F0FF]"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <PlaceholderAvatar name={student.student_name} />
                )}
                <div>
                  <div className="text-lg font-bold text-[#130347]">
                    {student.student_name || '-'}
                  </div>
                  <div className="text-sm text-[#465d71]">
                    รหัสนิสิต: {student.student_id || '-'}
                  </div>
                </div>
              </div>

              {/* รายละเอียดเป็นกริดพอดี ๆ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Row label="อีเมล" value={student.email} />
                <Row label="เบอร์โทร" value={student.phone_number} />
                <Row label="มหาวิทยาลัย" value={student.university} />
                <Row label="คณะ" value={student.faculty} />
                <Row label="สาขาวิชา" value={student.major} />
                <Row label="ชั้นปี" value={student.year_level} />
                <Row label="เพศ" value={student.gender} />
                <Row label="GPA" value={student.gpa} />
                <Row label="วันเกิด" value={fmt(student.birth_date)} />
                <Row label="อายุ" value={student.age} />
                <div className="md:col-span-2">
                  <Row label="ทักษะพิเศษ" value={student.special_skills} />
                </div>
              </div>

              <hr className="my-6 border-[#E6F0FF]" />

              {/* ช่วงฝึกงาน */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Row label="วันที่เริ่มฝึกงาน" value={fmt(student.intern_start_date)} />
                <Row label="วันที่สิ้นสุดฝึกงาน" value={fmt(student.intern_end_date)} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
