// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* ซ้าย: โลโก้ใหญ่ พื้นฟ้าพาสเทล */}
      <div className="flex items-center justify-center bg-[#9ae5f2]">
        <img
          src="/uploads/InternConnectLogo2.png"
          alt="InternConnect"
          className="w-[340px] h-[340px] object-contain drop-shadow-lg"
        />
      </div>

      {/* ขวา: ฟอร์มพื้นขาว */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#063D8C] mb-2">
            ลืมรหัสผ่าน
          </h2>
          <p className="text-sm text-center text-[#4691D3] mb-8">
            กรอกอีเมลเพื่อรับลิงก์รีเซ็ตรหัสผ่าน
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border bg-white
                         border-[#6EC7E2] placeholder-slate-400
                         focus:outline-none focus:ring-4 focus:ring-[#95FCF2] focus:border-[#225EC4]"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold
                         bg-[#1bc7e6] hover:bg-[#4db7e8] text-white shadow-sm transition"
            >
              ส่งลิงก์รีเซ็ตรหัสผ่าน
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.includes('ส่ง') || message.includes('เรียบร้อย')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
