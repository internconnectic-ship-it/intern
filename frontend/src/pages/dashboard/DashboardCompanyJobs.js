import React, { useState, useEffect } from 'react';
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

  // ดึงข้อมูลจาก company
  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) return;
    api.get(`/api/company/${companyId}`)
      .then(res => {
        setJob(prev => ({
          ...prev,
          business_type: res.data.business_type || '',
          address: res.data.address || '',
          google_maps_link: res.data.google_maps_link || '',
          email: res.data.contact_email || '',
          phone_number: res.data.phone_number || ''
        }));
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    // ไม่ให้แก้ business_type, address, google_maps_link, email, phone_number
    if (
      ["business_type", "address", "google_maps_link", "email", "phone_number"].includes(e.target.name)
    ) return;
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
              {/* ตำแหน่งที่เปิดรับ */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">ตำแหน่งที่เปิดรับ</label>
                <input
                  name="position"
                  type="text"
                  value={job.position}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                  required
                />
              </div>
              {/* ประเภทธุรกิจ */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">ประเภทธุรกิจ</label>
                <input
                  name="business_type"
                  type="text"
                  value={job.business_type}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                  required
                />
              </div>
              {/* รายละเอียดงาน */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">รายละเอียดงาน</label>
                <input
                  name="job_description"
                  type="text"
                  value={job.job_description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                  required
                />
              </div>
              {/* คุณสมบัติที่ต้องการ */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">คุณสมบัติที่ต้องการ</label>
                <input
                  name="requirements"
                  type="text"
                  value={job.requirements}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                  required
                />
              </div>
              {/* ค่าตอบแทน */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">ค่าตอบแทน (บาท/เดือน)</label>
                <input
                  name="compensation"
                  type="number"
                  step="0.01"
                  value={job.compensation}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                  required
                />
              </div>
              {/* จำนวนที่รับสมัคร */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">จำนวนที่รับสมัคร</label>
                <input
                  name="max_positions"
                  type="number"
                  value={job.max_positions}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                  required
                />
              </div>
              {/* ที่อยู่บริษัท */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">ที่อยู่บริษัท</label>
                <input
                  name="address"
                  type="text"
                  value={job.address}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                  required
                />
              </div>
              {/* Google Maps Link */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">Google Maps Link</label>
                <input
                  name="google_maps_link"
                  type="text"
                  value={job.google_maps_link}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 mb-1">
                  กดปุ่ม "แชร์" → เลือก "ฝังแผนที่" และคัดลอกลิงก์ที่อยู่ใน iframe src="..."
                </p>
              </div>
              {/* วันที่เริ่มรับสมัคร */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">วันที่เริ่มรับสมัคร</label>
                <input
                  name="start_date"
                  type="date"
                  value={job.start_date}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                  required
                />
              </div>
              {/* วันสิ้นสุดรับสมัคร */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">วันสิ้นสุดรับสมัคร</label>
                <input
                  name="end_date"
                  type="date"
                  value={job.end_date}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                  required
                />
              </div>
              {/* อีเมลสำหรับติดต่อ */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">อีเมลสำหรับติดต่อ</label>
                <input
                  name="email"
                  type="email"
                  value={job.email}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                  required
                />
              </div>
              {/* เบอร์โทรศัพท์ */}
              <div>
                <label className="block font-semibold mb-1 text-[#465d71]">เบอร์โทรศัพท์</label>
                <input
                  name="phone_number"
                  type="text"
                  value={job.phone_number}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                  required
                />
              </div>
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
