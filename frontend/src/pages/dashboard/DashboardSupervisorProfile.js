// src/pages/dashboard/DashboardSupervisorProfile.jsx
import React, { useState, useEffect } from 'react';
import api from "../../axios";   // ✅ ใช้ axios instance
import Header from '../../components/Header';

const DashboardSupervisorProfile = () => {
  const [form, setForm] = useState({
    supervisor_id: '',
    supervisor_name: '',
    email: '',
    phone_number: '',
    department: '',
    faculty: '',
    position: '',
    profile_image: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const supervisorId = localStorage.getItem('supervisorId');

  useEffect(() => {
    if (supervisorId) {
      api.get(`/api/supervisor/${supervisorId}`)
        .then((res) => {
          const data = res.data;
          setForm({
            supervisor_id: data.supervisor_id || '',
            supervisor_name: data.supervisor_name || '',
            email: data.email || '',
            phone_number: data.phone_number || '',
            department: data.department || '',
            faculty: data.faculty || '',
            position: data.position || '',
            profile_image: data.profile_image || ''
          });
        })
        .catch((err) => {
          console.error('❌ โหลดข้อมูลอาจารย์นิเทศล้มเหลว:', err);
          setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        });
    }
  }, [supervisorId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let profileImageFilename = form.profile_image;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      try {
        const res = await api.post('/api/upload/profile-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        profileImageFilename = res.data.filename;
      } catch (err) {
        console.error('❌ อัปโหลดรูปโปรไฟล์ล้มเหลว:', err);
        alert('เกิดข้อผิดพลาดในการอัปโหลดรูป');
        return;
      }
    }

    const updatedForm = { ...form, profile_image: profileImageFilename };

    api.put(`/api/supervisor/${supervisorId}`, updatedForm)
      .then(() => {
        localStorage.setItem('profile_image', profileImageFilename);
        alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
      })
      .catch((err) => {
        console.error('❌ บันทึกข้อมูลล้มเหลว:', err);
        alert('เกิดข้อผิดพลาดในการบันทึก');
      });
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#063D8C]">
      <Header />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-10">
        {/* หัวเรื่อง */}
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-[#130347]">โปรไฟล์อาจารย์นิเทศ</h1>
          {error && <p className="mt-2 text-rose-600">{error}</p>}
        </div>

        {/* การ์ดฟอร์ม */}
        <div className="bg-white border border-[#E6F0FF] rounded-2xl shadow-md p-6">
          {/* รูปโปรไฟล์ */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#E6F0FF] bg-[#F8FBFF]">
              {form.profile_image ? (
                <img
                  src={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/${form.profile_image}`}
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

          {/* ฟิลด์ข้อมูล */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#225EC4]">รหัสอาจารย์</label>
              <input
                name="supervisor_id"
                value={form.supervisor_id}
                disabled
                className="w-full rounded-xl border border-[#E6F0FF] bg-gray-100 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">ชื่อ</label>
              <input
                name="supervisor_name"
                value={form.supervisor_name}
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
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">เบอร์โทร</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                required
                pattern="^[0-9]{10}$"
                title="กรุณากรอกเบอร์โทร 10 หลัก"
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">ภาควิชา</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">คณะ</label>
              <input
                name="faculty"
                value={form.faculty}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#225EC4]">ตำแหน่ง</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>
          </div>

          {/* ปุ่มบันทึก */}
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

export default DashboardSupervisorProfile;
