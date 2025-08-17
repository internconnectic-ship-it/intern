// src/pages/dashboard/DashboardAdminProfile.jsx
import React, { useEffect, useState } from 'react';
import api from "../../axios";    // ✅ ใช้ axios instance ที่ config แล้ว
import Header from '../../components/Header';

const DashboardAdminProfile = () => {
  const [adminId, setAdminId] = useState(null);
  const [admin, setAdmin] = useState({
    admin_id: '',
    admin_name: '',
    email: '',
    phone_number: '',
    role: 'admin',
    profile_image: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('adminId');
    if (id) {
      setAdminId(id);
      setAdmin(prev => ({ ...prev, admin_id: id }));
    } else {
      setError('ไม่พบ adminId กรุณา login ใหม่');
    }
  }, []);

  useEffect(() => {
    if (!adminId) return;
    api.get(`/api/admin/${adminId}`)
      .then(res => {
        if (res.data) setAdmin(prev => ({ ...prev, ...res.data }));
      })
      .catch(err => {
        console.error('❌ โหลดข้อมูลล้มเหลว:', err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      });
  }, [adminId]);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let profileImageFilename = admin.profile_image;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const res = await api.post('/api/upload/profile-image', formData);
        profileImageFilename = res.data.filename;
      }
      const updatedAdmin = { ...admin, profile_image: profileImageFilename };
      await api.put(`/api/admin/${adminId}`, updatedAdmin);
      localStorage.setItem('profile_image', profileImageFilename);
      alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (err) {
      console.error('❌ อัปเดตข้อมูลล้มเหลว:', err);
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#063D8C]">
      <Header />
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-[#130347]">โปรไฟล์ผู้ดูแล</h1>
          {error && <p className="mt-2 text-rose-600">{error}</p>}
        </div>

        <div className="bg-white border border-[#E6F0FF] rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#E6F0FF] bg-[#F8FBFF]">
              {admin.profile_image ? (
                <img
                  src={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/${admin.profile_image}`}
                  alt="รูปโปรไฟล์"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#225EC4]">
                  ไม่มีรูป
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#225EC4]">อัปโหลดรูปโปรไฟล์</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#6EC7E2] file:text-white file:px-4 file:py-2 hover:file:bg-[#4691D3]"
              />
            </div>
          </div>

          {/* ฟิลด์ต่าง ๆ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#225EC4]">รหัสผู้ดูแล</label>
              <input
                name="admin_id"
                value={admin.admin_id}
                disabled
                className="w-full rounded-xl border border-[#E6F0FF] bg-gray-100 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">ชื่อ</label>
              <input
                name="admin_name"
                value={admin.admin_name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">อีเมล</label>
              <input
                name="email"
                type="email"
                value={admin.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">เบอร์โทร</label>
              <input
                name="phone_number"
                value={admin.phone_number}
                onChange={handleChange}
                required
                pattern="^[0-9]{10}$"
                title="กรุณากรอกเบอร์โทร 10 หลัก"
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">บทบาท</label>
              <input
                name="role"
                value={admin.role}
                disabled
                className="w-full rounded-xl border border-[#E6F0FF] bg-gray-100 px-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-[#225EC4] hover:bg-[#1b55b5] text-white py-3 font-semibold shadow-sm"
          >
            💾 บันทึก
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardAdminProfile;
