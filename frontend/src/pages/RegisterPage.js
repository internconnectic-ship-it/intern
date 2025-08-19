// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const RegisterPage = () => {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert('❗ กรุณาเลือกประเภทผู้ใช้ก่อน');
      return;
    }

    // ✅ ตรวจสอบรหัสผ่านและยืนยันรหัสผ่าน
    if (formData.password !== formData.confirmPassword) {
      alert('❌ รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    // ✅ ตรวจสอบความแข็งแรงรหัสผ่าน
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strongPassword.test(formData.password)) {
      alert("❌ รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และประกอบด้วย:\n- ตัวพิมพ์เล็ก\n- ตัวพิมพ์ใหญ่\n- ตัวเลข\n- อักขระพิเศษ");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role
      });
      alert('✅ สมัครสมาชิกสำเร็จ');
      navigate('/login');
    } catch (err) {
      console.error('❌ สมัครไม่สำเร็จ:', err);
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัคร');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* ซ้าย: โลโก้ใหญ่บนพื้นฟ้า (เข้าชุด Login) */}
      <div className="flex items-center justify-center bg-[#9ae5f2]">
        <img
          src="InternConnectLogo2.png"
          alt="InternConnect"
          className="w-[360px] h-[360px] object-contain drop-shadow-lg"
        />
      </div>

      {/* ขวา: ฟอร์มพื้นขาว */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#063D8C] mb-2">
            สมัครสมาชิก
          </h2>
          <p className="text-sm text-center text-[#4691D3] mb-8">
            กรอกข้อมูลให้ครบถ้วนเพื่อสร้างบัญชี
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                เลือกประเภทผู้ใช้
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
                <option value="student">นิสิต</option>
                <option value="company">สถานประกอบการ</option>
              </select>
            </div>

            {role && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {role === 'student' ? 'รหัสนิสิต' : 'เลขทะเบียนนิติบุคคล'}
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border bg-white
                               border-[#6EC7E2] focus:outline-none focus:ring-4
                               focus:ring-[#95FCF2] focus:border-[#225EC4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    ชื่อ
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    รหัสผ่าน
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border bg-white
                               border-[#6EC7E2] focus:outline-none focus:ring-4
                               focus:ring-[#95FCF2] focus:border-[#225EC4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    ยืนยันรหัสผ่าน
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border bg-white
                               border-[#6EC7E2] focus:outline-none focus:ring-4
                               focus:ring-[#95FCF2] focus:border-[#225EC4]"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold
                         bg-[#1bc7e6] hover:bg-[#4db7e8] text-white shadow-sm transition"
            >
              สมัครสมาชิก
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
