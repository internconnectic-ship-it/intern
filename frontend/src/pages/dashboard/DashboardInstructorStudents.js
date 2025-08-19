import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import api from "../../axios";// ✅ ใช้ axios instance เดียวกัน

const DashboardInstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/instructor/students')
      .then(res => {
        console.log("📦 ได้ข้อมูลนิสิต:", res.data);
        setStudents(res.data);
      })
      .catch(err => {
        console.error("❌ ไม่สามารถโหลดข้อมูลนิสิต:", err);
      });
  }, []);

  const handleViewDetails = (studentId) => {
    navigate(`/student-detail/${studentId}`);
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] font-sans">
      <Header />
      <div className="mt-6 mx-auto" style={{ maxWidth: '88%' }}>
        
        {/* หัวข้ออยู่นอกกล่อง */}
        <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2 text-[#130347]">
          รายชื่อนิสิต
        </h2>

        <div
          className="bg-white text-[#130347] rounded-2xl shadow-lg border border-[#E6F0FF]"
          style={{ padding: '3%' }}
        >
          {students.length === 0 ? (
            <p className="text-[#465d71]">ไม่มีข้อมูลนิสิต</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#E6F0FF]">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FBFF] text-[#225EC4]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold border-b border-[#E6F0FF]">รหัสนิสิต</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-[#E6F0FF]">ชื่อนิสิต</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-[#E6F0FF]">อีเมล</th>
                    <th className="px-4 py-3 text-center font-semibold border-b border-[#E6F0FF]">เพิ่มเติม</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student.student_id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-[#F9FBFE]'}
                    >
                      <td className="px-4 py-3 border-b border-[#E6F0FF]">{student.student_id}</td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF]">{student.student_name}</td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF]">{student.email}</td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF] text-center">
                        <button
                          onClick={() => handleViewDetails(student.student_id)}
                          className="bg-[#225EC4] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#063D8C] transition shadow-sm"
                        >
                          ดูเพิ่มเติม
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardInstructorStudents;
