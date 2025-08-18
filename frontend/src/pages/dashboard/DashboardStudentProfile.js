// src/pages/dashboard/DashboardStudentProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DashboardStudentProfile = () => {
  const [student, setStudent] = useState({
    student_name: '',
    email: '',
    phone_number: '',
    major: '',
    faculty: '',
    university: '',
    gender: '',
    year_level: '',
    gpa: '',
    birth_date: '',
    age: '',
    special_skills: '',
    profile_image: '',
    intern_start_date: '',
    intern_end_date: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentId) return;
    axios
      .get(`${API_URL}/api/student/${studentId}`)
      .then(res => setStudent(res.data || {}))
      .catch(err => console.error('❌ โหลดข้อมูลล้มเหลว', err));
  }, [studentId]);

  const handleChange = (e) => setStudent({ ...student, [e.target.name]: e.target.value });
  const handleImageUpload = (e) => setSelectedFile(e.target.files?.[0] || null);
  const formatDate = (d) => (d ? new Date(d).toISOString().split('T')[0] : '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔎 Validation
    if (student.gpa && (isNaN(student.gpa) || student.gpa < 0 || student.gpa > 4))
      return alert('กรุณากรอก GPA ที่อยู่ระหว่าง 0.00 ถึง 4.00');

    if (student.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email))
      return alert('กรุณากรอกอีเมลให้ถูกต้อง');

    if (student.phone_number && !/^\d{10}$/.test(student.phone_number))
      return alert('กรุณากรอกเบอร์โทร 10 หลัก');

    if (student.birth_date && new Date(student.birth_date) > new Date())
      return alert('วันเกิดต้องไม่เกินวันที่ปัจจุบัน');

    if (
      student.intern_start_date &&
      student.intern_end_date &&
      new Date(student.intern_start_date) > new Date(student.intern_end_date)
    ) return alert('วันที่เริ่มฝึกงานต้องไม่มากกว่าวันที่สิ้นสุด');

    // 📸 Upload รูป
    let profileImageFilename = student.profile_image;
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      try {
        const res = await axios.post(`${API_URL}/api/upload/profile-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        profileImageFilename = res.data.filename;
      } catch (err) {
        console.error('❌ อัปโหลดรูปภาพล้มเหลว', err);
        return alert('เกิดข้อผิดพลาดในการอัปโหลดรูป');
      }
    }

    // 💾 Update ข้อมูล
    try {
      const updated = { ...student, profile_image: profileImageFilename };
      console.log("📤 ส่งข้อมูลอัปเดต:", updated);
      await axios.put(`${API_URL}/api/student/${studentId}`, updated);
      localStorage.setItem('profile_image', profileImageFilename || '');
      localStorage.setItem('name', updated.student_name || '');
      alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (err) {
      console.error('❌ บันทึกข้อมูลล้มเหลว', err);
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#063D8C]">
      <Header />

      <form onSubmit={handleSubmit} className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-[#130347]">👤 โปรไฟล์นิสิต</h1>
          <p className="text-sm text-[#465d71]">
            อัปเดตข้อมูลส่วนตัว ช่องทางติดต่อ และช่วงเวลาฝึกงานของคุณ
          </p>
        </div>

        <div className="bg-white border border-[#E6F0FF] rounded-2xl shadow-sm p-6">
          {/* โปรไฟล์ */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#E6F0FF] bg-[#F8FBFF]">
              {student.profile_image ? (
                <img
                  src={`${API_URL}/uploads/${student.profile_image}`}
                  alt="รูปโปรไฟล์"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#225EC4] text-sm">
                  ไม่มีรูป
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#225EC4]">อัปโหลดรูปโปรไฟล์</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full text-sm file:mr-3 file:rounded-full file:border-0 
                  file:bg-[#6EC7E2] file:text-white file:px-4 file:py-2 hover:file:bg-[#4691D3]"
              />
            </div>
          </div>

          {/* ฟอร์ม: 2 คอลัมน์บน md, 3 คอลัมน์บน xl */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              { label: 'ชื่อ', name: 'student_name' },
              { label: 'อีเมล', name: 'email', type: 'email' },
              { label: 'เบอร์โทร', name: 'phone_number' },
              { label: 'สาขาวิชา', name: 'major' },
              { label: 'คณะ', name: 'faculty' },
              { label: 'มหาวิทยาลัย', name: 'university' },
              { label: 'เพศ', name: 'gender' },
              { label: 'ชั้นปี', name: 'year_level', type: 'number' },
              { label: 'GPA', name: 'gpa', type: 'text', inputMode: 'decimal' },
              { label: 'อายุ', name: 'age', type: 'number' },
            ].map(({ label, name, type = 'text', inputMode }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-[#225EC4]">{label}</label>
                <input
                  name={name}
                  type={type}
                  inputMode={inputMode}
                  value={student[name] || ''}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] 
                    px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">วันเกิด</label>
              <input
                name="birth_date"
                type="date"
                value={formatDate(student.birth_date)}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 
                  outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">🗓 วันที่เริ่มฝึกงาน</label>
              <input
                type="date"
                name="intern_start_date"
                value={formatDate(student.intern_start_date)}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 
                  outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">🗓 วันที่สิ้นสุดฝึกงาน</label>
              <input
                type="date"
                name="intern_end_date"
                value={formatDate(student.intern_end_date)}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 
                  outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="block text-sm font-medium text-[#225EC4]">ทักษะพิเศษ</label>
              <textarea
                name="special_skills"
                rows={3}
                value={student.special_skills || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] 
                  px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2] resize-y"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-[#225EC4] hover:bg-[#1b55b5] text-white py-3 
              font-semibold shadow-sm"
          >
            💾 บันทึก
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardStudentProfile;
