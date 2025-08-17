// src/pages/dashboard/DashboardAdminReports.jsx
import React, { useEffect, useMemo, useState } from 'react';
import api from "../../axios";  // ✅ ใช้ axios instance
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import Header from '../../components/Header';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const palette = ['#225EC4', '#4691D3', '#6EC7E2', '#95FCF2', '#063D8C'];

const DashboardAdminReports = () => {
  const [summary, setSummary] = useState({});
  const [topCompanies, setTopCompanies] = useState([]);
  const [topProvinces, setTopProvinces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, companiesRes, provincesRes] = await Promise.all([
          api.get('/api/reports/summary'),
          api.get('/api/reports/top-companies'),
          api.get('/api/reports/top-provinces'),
        ]);
        setSummary(summaryRes.data || {});
        setTopCompanies(companiesRes.data || []);
        setTopProvinces(provincesRes.data || []);
      } catch (err) {
        console.error('❌ ดึงข้อมูลล้มเหลว:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const createBarData = (data, label) => {
    const labels = data.map((d) => d.label);
    const values = data.map((d) => d.count);
    const colors = values.map((_, i) => palette[i % palette.length]);
    return {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: colors,
          borderRadius: 8,
        },
      ],
    };
  };

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#063D8C',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          padding: 10,
          cornerRadius: 10,
        },
      },
      scales: {
        x: { ticks: { color: '#063D8C' }, grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { color: '#063D8C', precision: 0 },
          grid: { color: '#E6F0FF' },
        },
      },
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#063D8C]">
      <Header />
      <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 py-8">
        <div className="mb-3">
          <h1 className="text-2xl font-extrabold text-[#130347]">สถิติระบบฝึกงาน</h1>
          <p className="mt-1 text-[#465d71]">
            ภาพรวมจำนวนผู้ใช้งาน ผลการประเมิน และข้อมูลยอดนิยม
          </p>
        </div>

        {/* สรุปตัวเลข */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E6F0FF] text-center">
            <p className="text-4xl font-extrabold text-[#225EC4]">
              {summary.studentCount || 0}
            </p>
            <p className="text-[#063D8C]/70">นิสิตทั้งหมด</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E6F0FF] text-center">
            <p className="text-4xl font-extrabold text-[#225EC4]">
              {summary.companyCount || 0}
            </p>
            <p className="text-[#063D8C]/70">สถานประกอบการ</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E6F0FF] text-center">
            <p className="text-4xl font-extrabold text-emerald-600">
              {summary.passedCount || 0}
            </p>
            <p className="text-[#063D8C]/70">ผ่าน</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E6F0FF] text-center">
            <p className="text-4xl font-extrabold text-rose-600">
              {summary.failedCount || 0}
            </p>
            <p className="text-[#063D8C]/70">ไม่ผ่าน</p>
          </div>
        </div>

        {/* กราฟ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E6F0FF]">
            <h2 className="text-md font-bold mb-3 text-[#225EC4]">
              🏢 อันดับสถานประกอบการยอดนิยม
            </h2>
            <div className="h-[320px]">
              {loading ? (
                <div className="w-full h-full rounded-xl bg-[#F8FBFF] animate-pulse" />
              ) : (
                <Bar data={createBarData(topCompanies, 'จำนวนนิสิต')} options={barOptions} />
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E6F0FF]">
            <h2 className="text-md font-bold mb-3 text-[#225EC4]">
              📍 จังหวัดที่มีสถานประกอบการเปิดรับนิสิตมากที่สุด
            </h2>
            <div className="h-[320px]">
              {loading ? (
                <div className="w-full h-full rounded-xl bg-[#F8FBFF] animate-pulse" />
              ) : (
                <Bar data={createBarData(topProvinces, 'จำนวนบริษัท')} options={barOptions} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminReports;
