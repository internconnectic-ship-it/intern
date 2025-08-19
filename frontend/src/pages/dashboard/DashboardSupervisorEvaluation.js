// src/pages/dashboard/DashboardSupervisorEvaluation.jsx
import React, { useEffect, useState } from 'react';
import api from "../../axios";  // ✅ ใช้ axios instance แทน
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PlaceholderAvatar = ({ name }) => {
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
  return (
    <div
      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm"
      style={{ backgroundColor: '#4691D3' }}
      aria-label="avatar"
    >
      {initials || 'S'}
    </div>
  );
};

const Chip = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const StatusBadge = ({ status = 'pending' }) => {
  const map = {
    completed: {
      text: 'ประเมินเสร็จสิ้น',
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    pending: {
      text: 'ยังไม่ประเมิน',
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  };
  const cfg = map[status] || map.pending;
  return <Chip className={cfg.cls}>{cfg.text}</Chip>;
};

const DashboardSupervisorEvaluation = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const supervisor_id = localStorage.getItem('supervisorId');
        const res = await api.get(`/api/evaluation/students/${supervisor_id}`);
        setStudents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ ดึงรายชื่อนิสิตล้มเหลว:', err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEvaluate = (student_id) => navigate(`/evaluation/${student_id}`);

  return (
    <div className="min-h-screen bg-[#9AE5F2]">
      <Header />

      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
        {/* หัวเรื่อง */}
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-[#130347]">ประเมินนิสิต</h1>
          <p className="text-sm text-[#465d71]">
            รายชื่อนิสิตในความดูแล พร้อมสถานะการประเมินและข้อมูลติดต่อ
          </p>
        </div>

        {/* กริดขนาดเดียวกับ DashboardSupervisor */}
        {loading ? (
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
          <div className="bg-white border border-[#E6F0FF] rounded-2xl p-10 text-center text-[#465d71]">
            ยังไม่มีนิสิตที่ต้องประเมิน
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {students.map((s) => {
              const hasImage = !!s.profile_image;
              const imgSrc = hasImage ? `${API_URL}/uploads/profile/${s.profile_image}` : '';

              return (
                <div
                  key={s.student_id}
                  className="bg-white rounded-2xl border border-[#E6F0FF] p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    {hasImage ? (
                      <img
                        src={imgSrc}
                        alt="profile"
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-[#E6F0FF]"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <PlaceholderAvatar name={s.student_name} />
                    )}

                    {/* ชื่อ + chips */}
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

                        {/* สถานะประเมิน */}
                        <StatusBadge status={s.evaluation_status} />
                      </div>
                    </div>
                  </div>

                  {/* รายละเอียดสั้น */}
                  <div className="mt-3 text-sm text-[#130347] space-y-1">
                    <p>📞 {s.phone_number || '-'}</p>
                    <p>📧 {s.email || '-'}</p>
                    <p>🏫 {s.university || '-'}</p>
                  
                  </div>

                  {/* ปุ่มประเมิน/แก้ไข */}
                  <div className="mt-4">
                    <button
                      onClick={() => handleEvaluate(s.student_id)}
                      className={`rounded-full text-white text-sm font-semibold px-4 py-2 shadow-sm ${
                        s.evaluation_status === 'completed'
                          ? 'bg-[#225EC4] hover:bg-[#1b55b5]'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {s.evaluation_status === 'completed' ? 'แก้ไขคะแนน' : 'ประเมิน'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSupervisorEvaluation;
