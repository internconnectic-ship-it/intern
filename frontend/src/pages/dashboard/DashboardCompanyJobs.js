import React, { useState } from 'react';
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import Header from '../../components/Header';

const JobPostForm = () => {
  const [job, setJob] = useState({
    position: '',
    business_type: '',
    job_description: '',
    requirements: '',
    compensation: '',
    max_positions: '',
    address: '',
    google_maps_link: '',
    start_date: '',
    end_date: '',
    email: '',
    phone_number: '',
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{5,15}$/;
    if (!phoneRegex.test(job.phone_number)) {
      alert('❌ กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เฉพาะตัวเลข 5-15 หลัก)');
      return;
    }

    if (parseInt(job.max_positions) < 0) {
      alert('❌ จำนวนที่รับสมัครต้องไม่ติดลบ');
      return;
    }

    if (parseFloat(job.compensation) < 0) {
      alert('❌ ค่าตอบแทนต้องไม่ติดลบ');
      return;
    }

    if (new Date(job.start_date) > new Date(job.end_date)) {
      alert('❌ วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มรับสมัคร');
      return;
    }

    try {
      const company_id = localStorage.getItem('companyId');

      const formattedStartDate = job.start_date?.slice(0, 10);
      const formattedEndDate = job.end_date?.slice(0, 10);

      await api.post(`/api/job_posting`, {
        ...job,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        company_id,
      });

      alert('✅ เพิ่มประกาศงานเรียบร้อยแล้ว');
      setJob({
        position: '',
        business_type: '',
        job_description: '',
        requirements: '',
        compensation: '',
        max_positions: '',
        address: '',
        google_maps_link: '',
        start_date: '',
        end_date: '',
        email: '',
        phone_number: '',
      });
    } catch (err) {
      console.error("❌ ERROR:", err.response?.data || err.message);
      alert('❌ เกิดข้อผิดพลาดในการเพิ่มประกาศงาน');
    }
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#130347] font-sans">
      <Header />

      <div className="flex justify-center p-6">
        <div className="w-full max-w-5xl">
          {/* หัวข้อ */}
          <h1 className="text-2xl font-extrabold text-[#130347] mb-6">
            เพิ่มประกาศงาน
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

              {/* ฟิลด์ Google Maps Link พร้อมคำอธิบาย */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">
                  Google Maps Link
                </label>
                
                <input
                  name="google_maps_link"
                  type="text"
                  value={job.google_maps_link}
                  onChange={handleChange}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                  required
                />
                <p className="text-xs text-gray-500 mb-1">
                  กดปุ่ม "แชร์" → เลือก "ฝังแผนที่" และคัดลอกลิงก์ที่อยู่ใน iframe src="..."
                </p>
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
                ➕ เพิ่มประกาศ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostForm;
