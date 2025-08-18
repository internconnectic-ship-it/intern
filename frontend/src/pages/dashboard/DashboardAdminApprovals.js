// src/pages/dashboard/DashboardAdminApprovals.jsx
import React, { useEffect, useMemo, useState } from 'react';
import api from "../../axios";   // ⬅️ ใช้ api จาก config กลาง
import Header from '../../components/Header';

const PlaceholderAvatar = ({ name }) => {
  const initials = (name || '?')
    .split(' ')
    .map(w => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow"
      style={{ backgroundColor: '#4691D3' }}
    >
      {initials || 'C'}
    </div>
  );
};

const Skeleton = () => (
  <div className="rounded-2xl border border-[#E6F0FF] bg-[#F8FBFF] p-5 shadow-sm animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-56 bg-gray-200 rounded" />
        <div className="h-3 w-80 bg-gray-200 rounded" />
        <div className="h-3 w-64 bg-gray-200 rounded" />
        <div className="h-3 w-72 bg-gray-200 rounded" />
      </div>
      <div className="w-40 h-9 bg-gray-200 rounded-full" />
    </div>
  </div>
);

const DashboardAdminApprovals = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/admin/companies/pending');
        setCompanies(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ ไม่สามารถดึงข้อมูลบริษัทที่รออนุมัติได้:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return companies;
    return companies.filter(c =>
      [c.company_name, c.email, c.business_type, c.address]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(s))
    );
  }, [companies, q]);

  const handleApprove = async (companyId) => {
    if (!window.confirm('ยืนยันการอนุมัติบริษัทนี้ใช่หรือไม่?')) return;
    try {
      const res = await api.put(`/api/admin/approve-company/${companyId}`);
      alert(res.data.message);
      setCompanies(list => list.filter(c => c.company_id !== companyId));
    } catch (err) {
      console.error('❌ เกิดข้อผิดพลาดในการอนุมัติ:', err);
      alert('ไม่สามารถอนุมัติได้');
    }
  };

  const handleDelete = async (companyId) => {
    if (!window.confirm('คุณต้องการลบบริษัทนี้หรือไม่?')) return;
    try {
      const res = await api.delete(`/api/admin/delete-company/${companyId}`);
      alert(res.data.message);
      setCompanies(list => list.filter(c => c.company_id !== companyId));
    } catch (err) {
      console.error('❌ เกิดข้อผิดพลาดในการลบ:', err);
      alert('ไม่สามารถลบได้');
    }
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2]">
      <Header />

      <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-[#130347]">บริษัทที่รอการอนุมัติ</h1>
            <p className="text-sm text-[#465d71]">
              ทั้งหมด {companies.length} รายการ · แสดง {filtered.length} รายการที่เข้ากับการค้นหา
            </p>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหา"
            className="w-full md:w-96 rounded-full border border-[#E6F0FF] bg-[#F8FBFF] px-4 py-2 text-[#130347] outline-none focus:ring-2 focus:ring-[#6EC7E2]"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {loading ? (
            <>
              <Skeleton /><Skeleton /><Skeleton /><Skeleton />
            </>
          ) : filtered.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-md p-10 text-center text-[#130347]">
                ไม่มีบริษัทที่รอการอนุมัติ
              </div>
            </div>
          ) : (
            filtered.map((company) => (
              <div
                key={company.company_id}
                className="rounded-2xl border border-[#E6F0FF] bg-[#F8FBFF] p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <PlaceholderAvatar name={company.company_name} />
                  <div className="flex-1 text-[#130347]">
                    <p className="text-lg font-semibold text-[#130347]">
                      <strong>ชื่อบริษัท:</strong> {company.company_name}
                    </p>
                    <div className="mt-1 text-sm space-y-0.5">
                      <p><strong className="text-[#465d71]">อีเมล:</strong> {company.email}</p>
                      {/* <p><strong className="text-[#465d71]">ประเภท:</strong> {company.business_type || 'ไม่ระบุ'}</p>
                      <p><strong className="text-[#465d71]">ที่อยู่:</strong> {company.address || 'ไม่ระบุ'}</p> */}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleApprove(company.company_id)}
                    className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold shadow-sm"
                  >
                    อนุมัติ
                  </button>
                  <button
                    onClick={() => handleDelete(company.company_id)}
                    className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-sm"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminApprovals;
