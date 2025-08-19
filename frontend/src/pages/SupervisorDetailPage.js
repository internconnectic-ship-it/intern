import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SupervisorDetailPage = () => {
  const { id } = useParams();
  const [supervisor, setSupervisor] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/supervisor/${id}`)
      .then(res => setSupervisor(res.data))
      .catch(err => {
        console.error("❌ ไม่สามารถโหลดรายละเอียด:", err);
      });
  }, [id]);

  if (!supervisor) {
    return (
      <div className="min-h-screen bg-[#9AE5F2] font-sans">
        <Header />
        <div className="p-6 text-center text-[#130347]">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#9AE5F2] font-sans">
      <Header />

      <div className="p-6 mt-6 max-w-5xl mx-auto">
        {/* หัวข้ออยู่นอกกล่อง */}
        <h2 className="text-2xl font-extrabold mb-6 text-left text-[#130347]">
          โปรไฟล์อาจารย์นิเทศ
        </h2>

        {/* กล่องข้อมูล */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full">
          {/* รูปโปรไฟล์อยู่ตรงกลาง */}
          <div className="flex flex-col items-center mb-6">
            {supervisor.profile_image && (
              <img
                src={`${API_URL}/uploads/profile/${supervisor.profile_image}`}
                alt="รูปอาจารย์"
                className="w-32 h-32 object-cover rounded-full border shadow"
              />
            )}
            <p className="mt-2 text-sm text-[#465d71]">รูปโปรไฟล์</p>
          </div>

          {/* ข้อมูล 2 คอลัมน์ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#465d71]">รหัสอาจารย์</label>
              <input
                type="text"
                value={supervisor.supervisor_id}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#465d71]">ชื่อ</label>
              <input
                type="text"
                value={supervisor.supervisor_name}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#465d71]">อีเมล</label>
              <input
                type="text"
                value={supervisor.email}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#465d71]">เบอร์โทร</label>
              <input
                type="text"
                value={supervisor.phone_number}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#465d71]">ภาควิชา</label>
              <input
                type="text"
                value={supervisor.department}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#465d71]">คณะ</label>
              <input
                type="text"
                value={supervisor.faculty}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#465d71]">ตำแหน่ง</label>
              <input
                type="text"
                value={supervisor.position}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDetailPage;
