import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const DashboardInstructorSupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/supervisor')
      .then(res => setSupervisors(res.data))
      .catch(err => console.error("❌ ไม่สามารถโหลดข้อมูลอาจารย์นิเทศ:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#9AE5F2] font-sans">
      <Header />
      <div className="p-6 mt-6 max-w-[90%] mx-auto">
        
        {/* หัวข้ออยู่นอกกล่อง */}
        <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2 text-[#130347]">
          รายชื่ออาจารย์นิเทศ
        </h2>

        <div className="bg-white text-[#130347] p-6 rounded-2xl shadow-lg border border-[#E6F0FF]">
          {supervisors.length === 0 ? (
            <p className="text-[#465d71]">ไม่มีข้อมูลอาจารย์นิเทศ</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#E6F0FF]">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FBFF] text-[#225EC4]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold border-b border-[#E6F0FF]">รหัส</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-[#E6F0FF]">ชื่ออาจารย์</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-[#E6F0FF]">อีเมล</th>
                    <th className="px-4 py-3 text-center font-semibold border-b border-[#E6F0FF]">เพิ่มเติม</th>
                  </tr>
                </thead>
                <tbody>
                  {supervisors.map((s, index) => (
                    <tr
                      key={s.supervisor_id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-[#F9FBFE]'}
                    >
                      <td className="px-4 py-3 border-b border-[#E6F0FF]">{s.supervisor_id}</td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF]">{s.supervisor_name}</td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF]">{s.email}</td>
                      <td className="px-4 py-3 border-b border-[#E6F0FF] text-center">
                        <button
                          className="bg-[#225EC4] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#063D8C] transition shadow-sm"
                          onClick={() => navigate(`/supervisor-detail/${s.supervisor_id}`)}
                        >
                          ดูเพิ่มเติม
                        </button>
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

export default DashboardInstructorSupervisors;
