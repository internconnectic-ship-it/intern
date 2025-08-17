// src/pages/dashboard/DashboardCompanyStatus.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import api from "../../axios";

const DashboardCompanyStatus = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();
  const company_id = localStorage.getItem('companyId');

  useEffect(() => {
    if (!company_id) return;
    api
      .get(`/api/job_posting/applications/${company_id}`)
      .then((res) => setApplications(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error('❌ ดึงข้อมูลนิสิตล้มเหลว:', err));
  }, [company_id]);

  const handleStatusChange = async (application_id, newStatus) => {
    try {
      await api.put(`/api/job_posting/application/status/${application_id}`, {
        status: newStatus,
      });
      setApplications((apps) =>
        apps.map((a) =>
          a.application_id === application_id ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error('❌ อัปเดตสถานะไม่สำเร็จ:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#063D8C]">
      <Header />

      <div className="w-[88%] mx-auto py-8">
        <h1 className="text-2xl font-extrabold text-[#130347] mb-4">
          สถานะการสมัครของนิสิต
        </h1>

        {applications.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center text-[#465d71]">
            ⛳ ยังไม่มีนิสิตสมัคร
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <div
                key={app.application_id}
                className="relative bg-white rounded-2xl border border-[#E6F0FF] p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                {/* ปุ่มขวาบน */}
                <div className="absolute right-4 top-4 flex gap-2">
                  <a
                    href={`${
                      process.env.REACT_APP_API_URL || 'http://localhost:5000'
                    }/uploads/resumes/${app.resume_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 shadow-sm"
                  >
                    📎 ดู Resume
                  </a>
                  <button
                    onClick={() => navigate(`/student-detail/${app.student_id}`)}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-4 py-2 shadow-sm"
                  >
                    👁️‍🗨️ ดูเพิ่มเติม
                  </button>
                </div>

                {/* เนื้อหา */}
                <div>
                  <p>
                    <strong>รหัสนิสิต:</strong> {app.student_id}
                  </p>
                  <p>
                    <strong>ชื่อ:</strong> {app.student_name}
                  </p>
                  <p>
                    <strong>อีเมล:</strong> {app.email}
                  </p>
                  <p>
                    <strong>เบอร์:</strong> {app.phone_number}
                  </p>
                  <p>
                    <strong>คณะ:</strong> {app.faculty}
                  </p>
                  <p>
                    <strong>สาขา:</strong> {app.major}
                  </p>
                  <p>
                    <strong>วันที่สมัคร:</strong>{' '}
                    {app.apply_date
                      ? new Date(app.apply_date).toLocaleDateString('th-TH')
                      : '-'}
                  </p>
                  <p>
                    <strong>ตำแหน่งที่สมัคร:</strong> {app.position}
                  </p>
                  <p>
                    <strong>ประเภทงาน:</strong> {app.business_type}
                  </p>
                </div>

                {/* แก้ไขสถานะ ล่างขวา */}
                <div className="flex justify-end mt-4">
                  <div className="flex items-center gap-2">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(
                          app.application_id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                    >
                      <option value="1">✅ รับ</option>
                      <option value="2">❌ ไม่รับ</option>
                      <option value="0">⏳ อยู่ระหว่างดำเนินการ</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCompanyStatus;
