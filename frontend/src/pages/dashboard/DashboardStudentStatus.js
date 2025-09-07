import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


const DashboardStudentStatus = () => {
  const studentId = localStorage.getItem('studentId');
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const formatDate = (dateStr) => dateStr?.split('T')[0];

    useEffect(() => {
      if (!studentId) return;

      api
        .get(``)
        .then((res) => {
          setApplications(res.data || []);
        })
        .catch((err) => {
          console.error('❌ โหลดข้อมูลล้มเหลว:', err);
          setApplications([]);
        });
    }, [studentId]);


  const getStatusColor = (status) => {
    switch (status) {
      case 'รอพิจารณา':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'รับ':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ไม่รับ':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleViewDetails = (jobId) => {
    if (!jobId) {
      alert('❌ ไม่พบ job_posting_id');
      return;
    }
    navigate(`/job-detail/${jobId}`, {
      state: { fromStatusPage: true },
    });
  };

  const handleConfirm = async (jobId) => {
  try {
    await api.post(`${API_URL}`, {
      student_id: studentId,
      job_posting_id: jobId,
    });

    // อัปเดต state ให้มี confirm แค่ job ที่เลือก
    setApplications((prev) =>
      prev.map((app) =>
        app.job_posting_id === jobId
          ? { ...app, confirmed: 1 }
          : { ...app, confirmed: 0 }
      )
    );
  } catch (err) {
    console.error("❌ ยืนยันฝึกงานล้มเหลว:", err);
  }
};
  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#063D8C]">
      <Header />

      <div className="w-[88%] mx-auto py-8">
        {/* หัวเรื่อง */}
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-[#130347]">สถานะการฝึกงาน</h1>
          <p className="text-sm text-[#465d71]">
            ตรวจสอบสถานะใบสมัคร ดูรายละเอียด และยืนยันการฝึกงานเมื่อได้รับการตอบรับ
          </p>
        </div>

        {/* การ์ดตาราง */}
        <div className="bg-white border border-[#E6F0FF] rounded-2xl shadow-md overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-8 text-center text-[#465d71]">ไม่มีข้อมูลการสมัครฝึกงาน</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8FBFF] text-[#465d71]">
                  <tr className="text-sm">
                    <th className="px-4 py-3 border-b border-[#E6F0FF]">บริษัท</th>
                    <th className="px-4 py-3 border-b border-[#E6F0FF]">ตำแหน่ง</th>
                    <th className="px-4 py-3 border-b border-[#E6F0FF]">วันที่สมัคร</th>
                    <th className="px-4 py-3 border-b border-[#E6F0FF]">สถานะ</th>
                    <th className="px-4 py-3 border-b border-[#E6F0FF] text-center">เพิ่มเติม</th>
                    <th className="px-4 py-3 border-b border-[#E6F0FF] text-center">ยืนยัน</th>
                  </tr>
                </thead>
                <tbody className="text-[#130347]">
                  {applications.map((app, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#F8FBFF] transition-colors"
                    >
                      <td className="px-4 py-3 border-b border-[#E6F0FF]">
                        {app.company_name}
                      </td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF]">
                        {app.position}
                      </td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF]">
                        {formatDate(app.apply_date)}
                      </td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF]">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF] text-center">
                        <button
                          onClick={() => handleViewDetails(app.job_posting_id)}
                          className="inline-flex items-center rounded-full bg-[#225EC4] hover:bg-[#1b55b5] text-white text-sm font-semibold px-4 py-1.5 shadow-sm"
                        >
                          ดูเพิ่มเติม
                        </button>
                      </td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF] text-center">
                        {app.confirmed === 1 ? (
                          // ✅ แถวที่ถูกยืนยัน
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-3 py-1.5">
                            <input type="checkbox" checked readOnly className="accent-emerald-600" />
                            ยืนยันแล้ว
                          </span>
                        ) : app.status === "รับ" ? (
                          // ❌ ยังไม่ได้ confirm แต่ status=รับ → ถ้ามีใคร confirm แล้ว ให้โชว์ "-"
                          applications.some((a) => a.confirmed === 1) ? (
                            <span className="text-[#465d71]">-</span>
                          ) : (
                            <button
                              onClick={() => handleConfirm(app.job_posting_id)}
                              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-1.5 shadow-sm"
                            >
                              ยืนยันฝึกงาน
                            </button>
                          )
                        ) : (
                          // อื่น ๆ → "-"
                          <span className="text-[#465d71]">-</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStudentStatus;
