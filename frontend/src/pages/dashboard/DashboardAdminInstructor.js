import React, { useEffect, useState } from "react";
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import Header from "../../components/Header";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DashboardAdminInstructor = () => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    api.get(`${API_URL}/api/instructor`)
      .then((res) => setInstructors(res.data))
      .catch((err) =>
        console.error("❌ ดึงข้อมูล instructors ล้มเหลว:", err)
      );
  }, []);

  return (
    <div className="min-h-screen bg-[#9ae5f2]">
      <Header />
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-2xl font-bold text-[#063D8C] mb-4">
          รายชื่อ Instructor
        </h2>

        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-[#6EC7E2] text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">ชื่อ</th>
              <th className="p-2">อีเมล</th>
              <th className="p-2">คณะ</th>
              <th className="p-2">ภาควิชา</th>
              <th className="p-2">เบอร์โทร</th>
              <th className="p-2">ตำแหน่ง</th>
              <th className="p-2">รูปโปรไฟล์</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((inst, i) => (
              <tr key={i} className="border-t text-center">
                <td className="p-2">{inst.Instructor_id}</td>
                <td className="p-2">{inst.Instructor_name}</td>
                <td className="p-2">{inst.email}</td>
                <td className="p-2">{inst.faculty || "-"}</td>
                <td className="p-2">{inst.department || "-"}</td>
                <td className="p-2">{inst.phone_number || "-"}</td>
                <td className="p-2">{inst.position || "-"}</td>
                <td className="p-2">
                  {inst.profile_image ? (
                    <img
                      //src={`${API_URL}/uploads/${inst.profile_image}`}
                      src={inst.profile_image}
                      alt="profile"
                      className="w-12 h-12 rounded-full mx-auto"
                    />
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAdminInstructor;
