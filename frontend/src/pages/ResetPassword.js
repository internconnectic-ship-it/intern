import { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ✅ Regex ตรวจสอบรหัสผ่าน
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบเงื่อนไขรหัสผ่าน
    if (!passwordRegex.test(password)) {
      setError(
        'รหัสผ่านต้องมีอย่างน้อย 8 ตัว และมี ตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่, ตัวเลข และอักขระพิเศษ'
      );
      return;
    }

    // ✅ ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกัน
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    } else {
      setError('');
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password`, { token, password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Token ไม่ถูกต้องหรือหมดอายุ');
      setTokenValid(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* ซ้าย: โลโก้ */}
      <div className="flex items-center justify-center bg-[#9ae5f2]">
        <img
          src="InternConnectLogo2.png"
          alt="InternConnect"
          className="w-[360px] h-[360px] object-contain drop-shadow-lg"
        />
      </div>

      {/* ขวา: ฟอร์ม */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#063D8C] mb-2">ตั้งรหัสผ่านใหม่</h2>
          <p className="text-sm text-[#4691D3] mb-6">
            กรุณากรอกรหัสผ่านใหม่ของคุณ
          </p>

          {tokenValid ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <input
                type="password"
                placeholder="รหัสผ่านใหม่"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border bg-white
                           border-[#6EC7E2] placeholder-slate-400
                           focus:outline-none focus:ring-4 focus:ring-[#95FCF2] focus:border-[#225EC4]"
              />

              <input
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border bg-white
                           border-[#6EC7E2] placeholder-slate-400
                           focus:outline-none focus:ring-4 focus:ring-[#95FCF2] focus:border-[#225EC4]"
              />

              {/* 🔑 กฎการตั้งรหัสผ่าน */}
              <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
                <li>อย่างน้อย 8 ตัวอักษร</li>
                <li>ต้องมี ตัวพิมพ์เล็ก และ ตัวพิมพ์ใหญ่</li>
                <li>ต้องมี ตัวเลข อย่างน้อย 1 ตัว</li>
                <li>ต้องมี อักขระพิเศษ อย่างน้อย 1 ตัว (@$!%*?&)</li>
              </ul>

              {/* แสดงข้อความ error ถ้ารหัสไม่ตรงกันหรือไม่ผ่าน regex */}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold
                           bg-[#225EC4] hover:bg-[#1b55b5] text-white shadow-sm transition"
              >
                รีเซ็ตรหัสผ่าน
              </button>
            </form>
          ) : (
            <p className="text-red-600 text-center font-medium">{message}</p>
          )}

          {message && tokenValid && (
            <p className="text-green-600 text-center mt-4 font-medium">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
