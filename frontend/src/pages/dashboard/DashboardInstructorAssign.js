// src/pages/dashboard/DashboardInstructorAssign.jsx
import React, { useEffect, useState } from 'react';
import api from "../../axios"; // ✅ ใช้ axios instance
import Header from '../../components/Header';

const DashboardInstructorAssign = () => {
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; // ✅ ใช้สำหรับรูป


  useEffect(() => {
    fetchStudents();
    fetchSupervisors();
  }, []);

  const fetchStudents = async () => {
  try {
    const res = await api.get('/api/instructor/confirmed-students/internship');
    setStudents(res.data);
  } catch (err) {
    console.error("❌ ดึงข้อมูลนิสิตล้มเหลว:", err);
  }
};

const fetchSupervisors = async () => {
  try {
    const res = await api.get('/api/instructor/supervisors');
    setSupervisors(res.data);
  } catch (err) {
    console.error("❌ ดึงรายชื่อ supervisor ล้มเหลว:", err);
  }
};


  const handleSelectInstructor = async (studentId, instructorId) => {
    try {
      await api.post('/api/instructor/assign-instructor', {
        student_id: studentId,
        instructor_id: instructorId,
      });
      console.log("✅ จับคู่ supervisor สำเร็จ");
      fetchStudents();
    } catch (err) {
      console.error("❌ จับคู่ supervisor ล้มเหลว:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] font-sans">
      <Header />

      <div className="px-[5%] py-[2%]">
        <h2 className="text-2xl font-extrabold text-[#130347] mb-6">
          รายชื่อนิสิตที่ต้องจับคู่อาจารย์นิเทศ
        </h2>

        {students.length === 0 ? (
          <p className="text-[#465d71]">ไม่มีข้อมูลนิสิต</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((student) => (
          <div
            key={student.student_id}
            className="relative bg-white text-[#130347] px-[5%] py-[4%] rounded-2xl shadow-md flex flex-row items-start gap-6"
          >
            {/* ดรอปดาวน์ขวาบน */}
            <div className="absolute top-3 right-3 w-[45%] md:w-[40%]">
              <select
                className="p-2 border rounded-lg w-full bg-white shadow-sm focus:ring-2 focus:ring-[#4691D3]"
                value={student.supervisor_id || ''}
                onChange={(e) =>
                  handleSelectInstructor(student.student_id, e.target.value)
                }
              >
                <option value="" disabled hidden>เลือกอาจารย์นิเทศ</option>
                {supervisors.map((sup) => (
                  <option key={sup.supervisor_id} value={sup.supervisor_id}>
                    {sup.supervisor_name}
                  </option>
                ))}
              </select>
            </div>

            {/* รูปนิสิต (ซ้ายบน) */}
            <img
              src={`${API_URL}/uploads/${student.profile_image || 'default-profile.png'}`}
              alt={student.student_name}
              className="w-24 h-24 object-cover rounded-full border-4 border-[#9AE5F2] shadow"
            />

            {/* ข้อมูลนิสิต */}
            <div className="flex-1 space-y-1">
              <p className="text-lg font-bold">{student.student_name}</p>
              <p className="text-sm">รหัสนิสิต: {student.student_id}</p>
              <p className="text-sm">อายุ: {student.age} | เพศ: {student.gender}</p>
              <p className="text-sm">เบอร์โทร: {student.phone_number}</p>
              <p className="text-sm">อีเมล: {student.email}</p>
              <p className="text-sm">บริษัทที่ไปฝึกงาน: {student.company_name}</p>
              <p className="text-sm">
                จังหวัดที่ฝึกงาน: {student.company_province?.trim() || "ไม่ทราบจังหวัด"}
              </p>

              {student.supervisor_name && (
                <p className="text-green-700 font-semibold mt-2">
                  ✅ อาจารย์ที่เลือกไว้: {student.supervisor_name}
                </p>
              )}
            </div>
          </div>

            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInstructorAssign;
