// frontend/src/pages/company/DashboardCompanyEvaluation.js
import React, { useEffect, useState } from 'react';
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';

const DashboardCompanyEvaluation = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const company_id = localStorage.getItem('companyId');
        const res = await api.get(`/api/evaluation/company/students/${company_id}`);
        setStudents(res.data);
      } catch (err) {
        console.error("❌ ดึงรายชื่อนิสิตล้มเหลว:", err);
      }
    };
    fetchStudents();
  }, []);

  const handleEvaluate = (student_id) => {
    navigate(`/evaluation/${student_id}`);
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#130347]">
      <Header />

      <div className="w-[88%] mx-auto py-6">
        {/* หัวข้อ */}
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          ประเมินนิสิต
        </h1>
        <p className="text-[#465d71] mb-6">
          รายชื่อนิสิตในความดูแล พร้อมสถานะการประเมินและข้อมูลติดต่อ
        </p>

        {/* รายการนิสิต */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {students.map((student) => (
            <div
              key={student.student_id}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              {/* รูปโปรไฟล์ */}
              <img
                src={
                  student.profile_image
                    ? student.profile_image   // 🌟 ใช้ URL จาก DB ตรง ๆ
                    : "/default-profile.png"  // หรือไฟล์ default ที่ฝั่ง frontend
                }
                alt={student.student_name}
                className="w-24 h-24 object-cover rounded-full border-4 border-[#6EC7E2] mb-4"
              />

              {/* ข้อมูลนิสิต */}
              <h2 className="font-bold text-lg">{student.student_name}</h2>
              <p className="text-sm text-gray-600">รหัสนิสิต: {student.student_id}</p>
              <p className="text-sm text-gray-600">เบอร์โทร: {student.phone_number}</p>
              <p className="text-sm text-gray-600">อีเมล: {student.email}</p>
              <p className="text-sm text-gray-600">{student.university}</p>
              <p className="text-sm text-gray-600">
                กำหนดสิ้นสุดการฝึกงาน:
              </p>


              {/* ปุ่มประเมิน/แก้ไข */}
                  <div className="mt-4">
                  <button
                    onClick={() => handleEvaluate(student.student_id)}
                    className={`rounded-full text-white text-sm font-semibold px-4 py-2 shadow-sm ${
                      student.evaluation_status !== 'completed'
                        ? 'bg-[#225EC4] hover:bg-[#1b55b5]' // เคยประเมินแล้ว
                        : 'bg-emerald-600 hover:bg-emerald-700' // ยังไม่ประเมิน
                    }`}
                  >
                    {student.evaluation_status !== 'completed' ? 'ประเมิน' : 'แก้ไขคะแนน'}
                  </button>
                  </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCompanyEvaluation;
