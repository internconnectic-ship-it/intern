// src/pages/dashboard/DashboardAdminProfile.jsx
import React, { useEffect, useState } from "react";
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import Header from "../../components/Header";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DashboardAdminProfile = () => {
  const [admin, setAdmin] = useState({
    admin_id: "",
    admin_name: "",
    email: "",
    phone_number: "",
    role: "admin",
    profile_image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const adminId = localStorage.getItem("adminId"); // ตาราง admin
  const userId = localStorage.getItem("id"); // ตาราง users

  useEffect(() => {
    if (!adminId) {
      setError("ไม่พบ adminId กรุณา login ใหม่");
      return;
    }
    api
      .get(`${API_URL}/api/admin/${adminId}`)
      .then((res) => setAdmin(res.data || {}))
      .catch((err) => {
        console.error("❌ โหลดข้อมูลล้มเหลว:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      });
  }, [adminId]);

  const handleChange = (e) =>
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  const handleImageUpload = (e) => setSelectedFile(e.target.files?.[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validate email & phone
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email);
    if (!emailOk) return alert("กรุณากรอกอีเมลให้ถูกต้อง");

    if (!/^\d{10}$/.test(admin.phone_number)) {
      return alert("กรุณากรอกเบอร์โทร 10 หลัก");
    }

    // --- upload image ---
    let profileImageFilename = admin.profile_image;
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const res = await api.post(
          `${API_URL}/api/upload/profile-image`,
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
      const updated = { ...admin, profile_image: profileImageFilename };
      await api.put(`${API_URL}/api/admin/${adminId}`, updated);

      localStorage.setItem("profile_image", profileImageFilename || "");
      localStorage.setItem("name", updated.admin_name || "");

      // --- password change check ---
      if (passwordForm.newPassword) {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          return alert("❌ รหัสผ่านใหม่และยืนยันรหัสไม่ตรงกัน");
        }

        const strongPassword =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPassword.test(passwordForm.newPassword)) {
          return alert(
            "❌ รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และประกอบด้วย:\n- ตัวพิมพ์เล็ก\n- ตัวพิมพ์ใหญ่\n- ตัวเลข\n- อักขระพิเศษ"
          );
        }

        await api.post(`${API_URL}/api/change-password`, {
          id: userId,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
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
      console.error("❌ อัปเดตข้อมูลล้มเหลว:", err);
      alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#063D8C]">
      <Header />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-8"
      >
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-[#130347]">👤 โปรไฟล์ผู้ดูแล</h1>
          {error && <p className="mt-2 text-rose-600">{error}</p>}
        </div>

        <div className="bg-white border border-[#E6F0FF] rounded-2xl shadow-sm p-6">
          {/* รูปโปรไฟล์ */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#E6F0FF] bg-[#F8FBFF]">
              {admin.profile_image ? (
                <img
                  src={`${API_URL}/uploads/profile/${admin.profile_image}`}
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
              <label className="block text-sm font-medium text-[#225EC4]">
                อัปโหลดรูปโปรไฟล์
              </label>
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
            {[
              { label: "รหัสผู้ดูแล", name: "admin_id", disabled: true },
              { label: "ชื่อ", name: "admin_name" },
              { label: "อีเมล", name: "email", type: "email" },
              { label: "เบอร์โทร", name: "phone_number" },
              { label: "บทบาท", name: "role", disabled: true },
            ].map(({ label, name, type = "text", disabled }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-[#225EC4]">
                  {label}
                </label>
                <input
                  name={name}
                  type={type}
                  value={admin[name] || ""}
                  onChange={handleChange}
                  disabled={disabled}
                  className={`w-full rounded-xl border border-[#E6F0FF] ${
                    disabled ? "bg-gray-100" : "bg-[#F8FBFF]"
                  } px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]`}
                />
              </div>
            ))}
          </div>

          {/* เปลี่ยนรหัสผ่าน */}
          <h2 className="text-lg font-bold text-[#130347] mt-8 mb-4">
            🔑 เปลี่ยนรหัสผ่าน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#225EC4]">
                รหัสผ่านปัจจุบัน
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#225EC4]">
                รหัสผ่านใหม่
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#225EC4]">
                ยืนยันรหัสผ่านใหม่
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2"
              />
            </div>
            <div>
              <span className="block text-sm text-gray-500">
                ***หมายเหตุ*** ถ้าไม่เปลี่ยนรหัสผ่านไม่ต้องกรอกรหัสผ่านใหม่
              </span>
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

export default DashboardAdminProfile;
