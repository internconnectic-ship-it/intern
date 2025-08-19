import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const JobEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/job_posting/${id}`)
      .then(res => {
        const formatted = {
          ...res.data,
          start_date: res.data.start_date?.split('T')[0] || '',
          end_date: res.data.end_date?.split('T')[0] || ''
        };
        setJob(formatted);
      })
      .catch(err => {
        console.error('❌ โหลด job ไม่สำเร็จ:', err);
        alert('ไม่พบข้อมูลประกาศงาน');
        navigate('/dashboard-company');
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/job_posting/${id}`, job);
      alert('✅ แก้ไขประกาศเรียบร้อยแล้ว');
      navigate('/dashboard/company');
    } catch (err) {
      console.error('❌ แก้ไขล้มเหลว:', err);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  if (!job) return <div className="text-white p-6">⏳ กำลังโหลด...</div>;

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#130347] font-sans">
      <Header />
      <div className="flex justify-center p-6">
        <div className="w-full max-w-5xl">
          <h1 className="text-2xl font-extrabold text-[#130347] mb-6">
            🛠 แก้ไขประกาศงาน
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'ตำแหน่งที่เปิดรับ', name: 'position' },
                { label: 'ประเภทธุรกิจ', name: 'business_type' },
                { label: 'รายละเอียดงาน', name: 'job_description' },
                { label: 'คุณสมบัติที่ต้องการ', name: 'requirements' },
                { label: 'ค่าตอบแทน (บาท/เดือน)', name: 'compensation', type: 'number', step: '0.01' },
                { label: 'จำนวนที่รับสมัคร', name: 'max_positions', type: 'number' },
                { label: 'ที่อยู่บริษัท', name: 'address' },
              ].map(({ label, name, type = 'text', step }) => (
                <div key={name}>
                  <label className="block font-semibold mb-1 text-[#465d71]">{label}</label>
                  <input
                    name={name}
                    type={type}
                    step={step}
                    value={job[name]}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                    required
                  />
                </div>
              ))}

              {/* Google Maps Link */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">
                  Google Maps Link
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  กดปุ่ม "แชร์" → เลือก "ฝังแผนที่" และคัดลอกลิงก์ที่อยู่ใน iframe src="..."
                </p>
                <input
                  name="google_maps_link"
                  type="text"
                  value={job.google_maps_link}
                  onChange={handleChange}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                  required
                />
              </div>

              {[
                { label: 'วันที่เริ่มรับสมัคร', name: 'start_date', type: 'date' },
                { label: 'วันสิ้นสุดรับสมัคร', name: 'end_date', type: 'date' },
                { label: 'อีเมลสำหรับติดต่อ', name: 'email', type: 'email' },
                { label: 'เบอร์โทรศัพท์', name: 'phone_number' },
              ].map(({ label, name, type = 'text', step }) => (
                <div key={name}>
                  <label className="block font-semibold mb-1 text-[#465d71]">{label}</label>
                  <input
                    name={name}
                    type={type}
                    step={step}
                    value={job[name]}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-[#225EC4] hover:bg-[#063D8C] text-white font-semibold py-2 px-4 rounded-full"
              >
                💾 บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobEditPage;
