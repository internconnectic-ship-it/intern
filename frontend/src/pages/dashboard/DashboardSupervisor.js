// src/pages/dashboard/DashboardSupervisor.jsx
import React, { useEffect, useState } from 'react';
import api from "../../axios"; // ✅ ใช้ axios instance แทน axios ตรงๆ
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';

/** Avatar ตัวอักษรย่อ */
const PlaceholderAvatar = ({ name }) => {
  const initials = (name || '?')
    .split(' ')
    .map(w => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
  return (
    <div
      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm bg-[#4691D3]"
      aria-label="avatar"
    >
      {initials || 'S'}
    </div>
  );
};

const Chip = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${className}`}
  >
    {children}
  </span>
);

const DashboardSupervisor = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const supervisorId = localStorage.getItem('supervisorId');

  useEffect(() => {
    if (!supervisorId) return;

    (async () => {
      try {
        const res = await api.get(`/api/supervisor/students/${supervisorId}`);
        setStudents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ โหลดข้อมูลนิสิตล้มเหลว:', err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [supervisorId]);

  return (
    <div className="min-h-screen bg-[#9AE5F2]">
      <Header />

      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
        {/* หัวเรื่อง */}
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-[#130347]">
            นิสิตในความรับผิดชอบ
          </h1>
          <p className="text-sm text-[#465d71]">
            รายชื่อนิสิตที่คุณดูแล พร้อมข้อมูลติดต่อและสถานที่ฝึกงาน
          </p>
        </div>

        {/* กริดรายการนิสิต */}
        {loading ? (
          // Skeleton โหลด
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#E6F0FF] bg-white p-5 shadow-sm animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-3 w-64 bg-gray-200 rounded" />
                    <div className="h-3 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-52 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="mt-4 h-9 bg-gray-200 rounded-full w-40" />
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          // ไม่มีนิสิต
          <div className="bg-white border border-[#E6F0FF] rounded-2xl p-10 text-center text-[#465d71]">
            ยังไม่มีนิสิตที่คุณดูแล
          </div>
        ) : (
          // มีนิสิต
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {students.map((s) => (
              <div
                key={s.student_id}
                className="bg-white rounded-2xl border border-[#E6F0FF] p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  {s.profile_image ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/${s.profile_image}`}
                      alt="profile"
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-[#E6F0FF]"
                      onError={(e) => {
                        // ถ้าโหลดรูปไม่ได้ ให้แทนด้วย PlaceholderAvatar
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.insertAdjacentElement(
                          'afterend',
                          (() => {
                            const el = document.createElement('div');
                            el.className =
                              'w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm bg-[#4691D3]';
                            el.textContent = (s.student_name || '?')
                              .split(' ')
                              .map(w => w[0]?.toUpperCase())
                              .slice(0, 2)
                              .join('');
                            return el;
                          })()
                        );
                      }}
                    />
                  ) : (
                    <PlaceholderAvatar name={s.student_name} />
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-[#130347]">
                          {s.student_name || '-'}
                        </h2>
                        <p className="text-xs text-[#465d71]">
                          รหัสนิสิต: {s.student_id || '-'}
                        </p>
                      </div>
                    </div>

                    {/* Chips */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {s.age && (
                        <Chip className="bg-[#F8FBFF] border-[#E6F0FF] text-[#130347]">
                          อายุ {s.age}
                        </Chip>
                      )}
                      {s.gender && (
                        <Chip className="bg-[#F8FBFF] border-[#E6F0FF] text-[#130347]">
                          เพศ {s.gender}
                        </Chip>
                      )}
                      {s.gpa && (
                        <Chip className="bg-[#F8FBFF] border-[#E6F0FF] text-[#130347]">
                          GPA {s.gpa}
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-[#130347] space-y-1">
                  <p>📞 {s.phone_number || '-'}</p>
                  <p>📧 {s.email || '-'}</p>
                  <p>🏫 {s.university || '-'}</p>
                  <p>
                    🏢 <strong>บริษัทที่ฝึก:</strong>{' '}
                    {s.company_name || 'ยังไม่ระบุ'}
                  </p>
                  <p>
                    📍 <strong>จังหวัด:</strong> {s.province || 'ยังไม่ระบุ'}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/student-detail/${s.student_id}`)}
                    className="rounded-full bg-[#225EC4] hover:bg-[#1b55b5] text-white text-sm font-semibold px-4 py-2 shadow-sm"
                  >
                    ดูข้อมูลเพิ่มเติม
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSupervisor;
