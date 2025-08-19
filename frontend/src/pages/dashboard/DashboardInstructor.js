// src/pages/dashboard/DashboardInstructor.jsx
import React, { useEffect, useState } from 'react';
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import Header from '../../components/Header';

const DashboardInstructor = () => {
  const [report, setReport] = useState([]);

 useEffect(() => {
  api
    .get('/api/instructor/internship-report/application')
    .then(res => setReport(Array.isArray(res.data) ? res.data : []))
    .catch(err => console.error('❌ โหลดรายงานล้มเหลว:', err));
}, []);


  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#063D8C]">
      <Header />

      <div className="w-[88%] mx-auto py-8">
        {/* หัวเรื่อง */}
        <h1 className="text-2xl font-extrabold text-[#130347] mb-6">
          จำนวนนิสิตที่สถานประกอบการรับเข้าฝึกงาน
        </h1>

        {/* ว่างเปล่า */}
        {report.length === 0 ? (
          <div className="bg-white border border-[#E6F0FF] rounded-2xl p-10 text-center text-[#465d71]">
            ⛳ ยังไม่มีข้อมูลรายงาน
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.map((company, index) => {
              const total = (company.positions || []).reduce(
                (sum, p) => sum + (p.student_count || 0),
                0
              );
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#E6F0FF] p-5 shadow-sm hover:shadow-md transition"
                >
                  {/* ส่วนหัวการ์ด */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl"></span>
                      <h2 className="text-lg font-bold text-[#130347]">
                        บริษัท {company.company_name}
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full bg-[rgb(61,227,246)] text-[#225EC4] border border-[#E6F0FF]">
                      รวม {total} คน
                    </span>
                  </div>

                  {/* ตาราง */}
                  <div className="overflow-hidden rounded-xl border border-[#E6F0FF]">
                    <table className="w-full text-sm">
                      <thead className="bg-[#F8FBFF] text-[#225EC4]">
                        <tr>
                          <th className="text-left font-semibold px-4 py-2">
                            ตำแหน่งงาน
                          </th>
                          <th className="text-left font-semibold px-4 py-2 w-28">
                            จำนวนนิสิต
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(company.positions || []).map((pos, i) => (
                          <tr
                            key={i}
                            className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9FBFE]'}
                          >
                            <td className="px-4 py-2 text-[#2c4055]">
                              {pos.position}
                            </td>
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-full bg-[#EAF5FF] text-[#225EC4] font-semibold">
                                {pos.student_count}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInstructor;
