// src/pages/dashboard/DashboardRegisterByAdmin.js
import { useState } from 'react';
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DashboardRegisterByAdmin = () => {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!role) {
    alert('❗ กรุณาเลือก role ก่อน');
    return;
  }

  try {
    const res = await api.post(`${API_URL}/api/auth/register`, {
      ...formData,
      role
    });
    alert(`✅ ${res.data.message || "สมัครสมาชิกสำเร็จ"}`);

    if (role === 'supervisor') {
      navigate('/instructor/supervisors'); // ✅ ไปหน้ารายชื่อ supervisor
    } else if (role === 'instructor') {
      navigate('/admin/instructors'); // ✅ ไปหน้ารายชื่อ instructor (เราสร้างไว้แล้ว)
    } else {
      navigate('/admin/reports'); // ✅ กันพลาด ถ้า role แปลกๆ ให้ไปหน้า dashboard ของ admin
    }
  } catch (err) {
    console.error('❌ สมัครไม่สำเร็จ:', err);
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัคร');
  }
};



  return (
    <div className="min-h-screen bg-[#9ae5f2]">
      <Header />

      <div className="flex justify-center items-center py-10">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center text-[#063D8C] mb-2">
            สมัครสมาชิกโดยผู้ดูแลระบบ
          </h2>
          <p className="text-sm text-center text-[#4691D3] mb-8">
            เลือก role และกรอกข้อมูลให้ครบถ้วน
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* เลือก role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                เลือก Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-white
                           border-[#6EC7E2] focus:outline-none focus:ring-4
                           focus:ring-[#95FCF2] focus:border-[#225EC4]"
                required
              >
                <option value="">-- กรุณาเลือก --</option>
                <option value="supervisor">Supervisor (อาจารย์นิเทศ)</option>
                <option value="instructor">Instructor (อาจารย์ประจำวิชา)</option>
              </select>
            </div>

            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {role === 'supervisor' ? 'Supervisor ID' : 'Instructor ID'}
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-3 py-2 rounded-lg border bg-white
                           border-[#6EC7E2] focus:outline-none focus:ring-4
                           focus:ring-[#95FCF2] focus:border-[#225EC4]"
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-white
                           border-[#6EC7E2] focus:outline-none focus:ring-4
                           focus:ring-[#95FCF2] focus:border-[#225EC4]"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                อีเมล
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-white
                           border-[#6EC7E2] focus:outline-none focus:ring-4
                           focus:ring-[#95FCF2] focus:border-[#225EC4]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border bg-white
                           border-[#6EC7E2] focus:outline-none focus:ring-4
                           focus:ring-[#95FCF2] focus:border-[#225EC4]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold
                         bg-[#1bc7e6] hover:bg-[#4db7e8] text-white shadow-sm transition"
            >
              สร้างบัญชี
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardRegisterByAdmin;
