import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="ชื่อ" onChange={handleChange} required /><br />
      <input name="email" type="email" placeholder="อีเมล" onChange={handleChange} required /><br />
      <input name="password" type="password" placeholder="รหัสผ่าน" onChange={handleChange} required /><br />
      <select name="role" onChange={handleChange} required>
        <option value="">-- เลือกบทบาท --</option>
        <option value="student">นักศึกษา</option>
        <option value="company">สถานประกอบการ</option>
      </select><br />
      <button type="submit">สมัครสมาชิก</button>
      <p>{message}</p>
    </form>
  );
}

export default Register;
