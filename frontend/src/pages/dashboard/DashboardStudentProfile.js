// src/pages/dashboard/DashboardStudentProfile.jsx

import React, { useState, useEffect } from 'react';
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
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

  // ✅ state สำหรับเปลี่ยนรหัสผ่าน
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // id จาก localStorage
  const studentId = localStorage.getItem('studentId'); // สำหรับตาราง student
  const userId = localStorage.getItem('id');       // สำหรับตาราง users

  useEffect(() => {
    if (!studentId) return;
    api
      .get(`/api/student/${studentId}`)
      .then(res => setStudent(res.data || {}))
      .catch(err => console.error('❌ โหลดข้อมูลล้มเหลว', err));
  }, [studentId]);

  const handleChange = (e) => setStudent({ ...student, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  const handleImageUpload = (e) => setSelectedFile(e.target.files?.[0] || null);
  const formatDate = (d) => (d ? d.split('T')[0] : '');

  // ✅ ฟังก์ชันบันทึกข้อมูลโปรไฟล์ + เปลี่ยนรหัสผ่าน
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- validate profile ---
    const gpa = parseFloat(student.gpa);
    if (isNaN(gpa) || gpa < 0 || gpa > 4)
      return alert("กรุณากรอก GPA ที่อยู่ระหว่าง 0.00 ถึง 4.00");

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email);
    if (!emailOk) return alert("กรุณากรอกอีเมลให้ถูกต้อง");

    if (!/^\d{10}$/.test(student.phone_number))
      return alert("กรุณากรอกเบอร์โทร 10 หลัก");

    if (student.birth_date && new Date(student.birth_date) > new Date())
      return alert("วันเกิดต้องไม่เกินวันที่ปัจจุบัน");

    if (
      student.intern_start_date &&
      student.intern_end_date &&
      new Date(student.intern_start_date) > new Date(student.intern_end_date)
    )
      return alert("วันที่เริ่มฝึกงานต้องไม่มากกว่าวันที่สิ้นสุด");

    // --- upload image ---
    let profileImageFilename = student.profile_image;
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const res = await api.post(
          "/api/upload/profile-image",
          formData
        );
        profileImageFilename = res.data.filename;
      } catch (err) {
        console.error("❌ อัปโหลดรูปภาพล้มเหลว", err);
        return alert("เกิดข้อผิดพลาดในการอัปโหลดรูป");
      }
    }

    try {
      // --- save profile ---
      const updated = { ...student, profile_image: profileImageFilename };
      await api.put(`/api/student/${studentId}`, updated);
      localStorage.setItem("profile_image", profileImageFilename || "");
      localStorage.setItem("name", updated.student_name || "");

      // --- password change check ---
      if (passwordForm.newPassword) {
        // 1) confirm password ตรงกัน
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          return alert("❌ รหัสผ่านใหม่และยืนยันรหัสไม่ตรงกัน");
        }

        // 2) ตรวจสอบความปลอดภัยของรหัสผ่าน
        const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPassword.test(passwordForm.newPassword)) {
          return alert(
            "❌ รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และประกอบด้วย:\n- ตัวพิมพ์เล็ก\n- ตัวพิมพ์ใหญ่\n- ตัวเลข\n- อักขระพิเศษ"
          );
        }

        // 3) ส่งเปลี่ยนรหัสผ่าน (ใช้ userId จาก users)
       await api.post(`${API_URL}/api/change-password`, {
        id: userId,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });


        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        alert("✅ บันทึกข้อมูลและเปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
      } else {
        alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว (รหัสผ่านยังคงเดิม)");
      }
    } catch (err) {
      console.error("❌ เกิดข้อผิดพลาด", err);
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#063D8C]">
      <Header />

      {/* 👉 ฟอร์มโปรไฟล์ */}
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
                  src={`${API_URL}/uploads/profile/${student.profile_image}`}
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
                className="mt-1 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#6EC7E2] file:text-white file:px-4 file:py-2 hover:file:bg-[#4691D3]"
              />
            </div>
          </div>

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
                  className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
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
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">🗓 วันที่เริ่มฝึกงาน</label>
              <input
                type="date"
                name="intern_start_date"
                value={formatDate(student.intern_start_date)}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#225EC4]">🗓 วันที่สิ้นสุดฝึกงาน</label>
              <input
                type="date"
                name="intern_end_date"
                value={formatDate(student.intern_end_date)}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
              />
            </div>

            {/* ทักษะพิเศษ */}
            <div className="md:col-span-2 xl:col-span-3">
              <label className="block text-sm font-medium text-[#225EC4]">ทักษะพิเศษ</label>
              <textarea
                name="special_skills"
                rows={3}
                value={student.special_skills || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2] resize-y"
              />
            </div>
          </div>

          {/* 👉 กล่องเปลี่ยนรหัสผ่าน */}
          <h2 className="text-lg font-bold text-[#130347] mb-4">🔑 เปลี่ยนรหัสผ่าน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#225EC4]">รหัสผ่านปัจจุบัน</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#225EC4]">รหัสผ่านใหม่</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#225EC4]">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-[#6d6d6d]">***หมายเหตุ***</label>
              <span className="text-xs text-[#6d6d6d]">ถ้าไม่เปลี่ยนรหัสผ่านไม่ต้องกรอกรหัสผ่านใหม่</span>
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

export default DashboardStudentProfile;
