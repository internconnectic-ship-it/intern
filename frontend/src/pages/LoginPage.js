// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import api from '../axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  //const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/auth/login`, form);
      console.log("Login Response:", res.data);
      const { token, role, id, email, name } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('id', id);
      localStorage.setItem('email', email);
      localStorage.setItem('name', name);

      const go = (path, key) => { localStorage.setItem(key, id); navigate(path); };
      if (role === 'student') go('/dashboard/student', 'studentId');
      else if (role === 'company') go('/dashboard/company', 'companyId');
      else if (role === 'instructor') go('/dashboard/instructor', 'instructorId');
      else if (role === 'supervisor') go('/dashboard/supervisor', 'supervisorId');
      else if (role === 'admin') go('/admin/approvals', 'adminId');
      else return setMessage('บทบาทผู้ใช้ไม่ถูกต้อง');

      setMessage('เข้าสู่ระบบสำเร็จ');
    } catch (err) {
      setMessage(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* ซ้าย: โลโก้ใหญ่ + พื้นหลังโทนฟ้า #6EC7E2 */}
      <div className="flex items-center justify-center bg-[#9ae5f2]">
        <img
          src="/backend/uploads/InternConnectLogo2.png"  
          alt="InternConnect"
          className="w-[360px] h-[360px] object-contain drop-shadow-lg"
        />
      </div>

      {/* ขวา: ฟอร์ม บนพื้นขาว */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#063D8C] mb-2">เข้าสู่ระบบ</h2>
          <p className="text-sm text-[#4691D3] mb-8">กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input
              type="email"
              name="email"
              placeholder="อีเมล"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border bg-white
                         border-[#6EC7E2] placeholder-slate-400
                         focus:outline-none focus:ring-4 focus:ring-[#95FCF2] focus:border-[#225EC4]"
            />
            <input
              type="password"
              name="password"
              placeholder="รหัสผ่าน"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border bg-white
                         border-[#6EC7E2] placeholder-slate-400
                         focus:outline-none focus:ring-4 focus:ring-[#95FCF2] focus:border-[#225EC4]"
            />
            <div className="flex justify-between items-center text-sm">
              <div></div>
              <a href="/forgot-password" className="text-[#225EC4] hover:underline">ลืมรหัสผ่าน?</a>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold
                         bg-[#1bc7e6] hover:bg-[#4db7e8] text-white shadow-sm transition"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-slate-600">
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" className="text-[#225EC4] hover:underline">
              สมัครสมาชิก
            </Link>
          </p>

          {message && (
            <p className="text-xs text-red-600 text-center mt-4">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
