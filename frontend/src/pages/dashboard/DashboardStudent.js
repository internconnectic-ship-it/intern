// src/pages/dashboard/DashboardStudent.jsx
import React, { useEffect, useState } from 'react';
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


const DashboardStudent = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [province, setProvince] = useState('');
  const [jobType, setJobType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('');
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error('❌ โหลด job_posting ล้มเหลว:', err);
      }
    };
    fetchJobs();
  }, []);
  

  const handleSearch = () => {
    const filtered = jobs.filter((job) => {
      const companyMatch = job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const provinceMatch = job.address?.toLowerCase().includes(province.toLowerCase());
      const typeMatch = job.business_type?.toLowerCase().includes(jobType.toLowerCase());
      return companyMatch && provinceMatch && typeMatch;
    });
    setFilteredJobs(filtered);
  };

  const handleViewMore = (id) => navigate(`/job-detail/${id}`);

  const img = (logo) => {logo || 'default.png'};

  return (
    <div className="min-h-screen bg-[#9AE5F2]">
      <Header />

      {/* ทำให้คอนเทนต์กว้างขึ้น และ padding กระชับ */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 py-8">
        {/* หัวเรื่อง */}
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-[#130347]">สถานประกอบการที่เปิดรับฝึกงาน</h1>
          <p className="text-sm mt-1 text-[#465d71]">ค้นหาจากชื่อบริษัท จังหวัด และประเภทงาน</p>
        </div>

        {/* 🔍 ช่องค้นหา */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <input
            type="text"
            placeholder="ชื่อสถานประกอบการ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-full w-64 border border-[#E6F0FF] bg-[#F8FBFF] text-[#130347] outline-none focus:ring-2 focus:ring-[#6EC7E2]"
          />
          <input
            type="text"
            placeholder="จังหวัด"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="px-4 py-2 rounded-full w-40 border border-[#E6F0FF] bg-[#F8FBFF] text-[#130347] outline-none focus:ring-2 focus:ring-[#6EC7E2]"
          />
          <input
            type="text"
            placeholder="ประเภทงาน"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="px-4 py-2 rounded-full w-40 border border-[#E6F0FF] bg-[#F8FBFF] text-[#130347] outline-none focus:ring-2 focus:ring-[#6EC7E2]"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-2 rounded-full bg-[#225EC4] hover:bg-[#1b55b5] text-white font-semibold shadow-sm"
          >
            🔍 ค้นหา
          </button>
        </div>

        {/* 🔁 รายการงาน — เพิ่มคอลัมน์ตามขนาดจอ เพื่อลดช่องว่างข้าง ๆ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.job_posting_id}
              className="bg-white border border-[#E6F0FF] rounded-2xl shadow-sm p-5 flex gap-4 items-start hover:shadow-md transition"
            >
              <img
                src={job.company_logo}
                alt="logo"
                className="w-20 h-20 object-cover rounded-2xl border border-[#E6F0FF] bg-white"
              />

              <div className="flex-1 space-y-1 text-[#130347]">
                <h3 className="text-lg font-bold">{job.company_name}</h3>
                <p className="text-sm">
                  <span className="font-semibold text-[#465d71]">ที่อยู่:</span> {job.address}
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-[#465d71]">ตำแหน่ง:</span> {job.position}
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-[#465d71]">ประเภท:</span> {job.business_type}
                </p>

                <button
                  onClick={() => handleViewMore(job.job_posting_id)}
                  className="mt-2 px-4 py-2 rounded-full bg-[#4691D3] hover:bg-[#3c84c6] text-white text-sm font-semibold shadow-sm"
                >
                  🔍 ดูเพิ่มเติม
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <p className="mt-6 text-[#130347]">ไม่พบข้อมูลงานที่ตรงกับเงื่อนไข</p>
        )}
      </div>
    </div>
  );
};

export default DashboardStudent;
