// src/pages/dashboard/DashboardAdminCompanies.js
import React, { useEffect, useMemo, useState } from 'react';
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import Header from '../../components/Header';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PlaceholderLogo = ({ name }) => {
  const initials = (name || '?')
    .split(' ')
    .map(w => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
  return (
    <div
      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm"
      style={{ backgroundColor: '#4691D3' }}
    >
      {initials || 'C'}
    </div>
  );
};

const DashboardAdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/admin/companies/approved');
        setCompanies(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ ไม่สามารถดึงข้อมูลบริษัทได้:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return companies;
    return companies.filter((c) =>
      [
        c.company_name,
        c.business_type,
        c.address,
        c.website,
        c.contact_email ?? c.email,
        c.contact_name,
        c.phone_number,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [companies, q]);

  const handleDelete = (companyId) => {
    if (!window.confirm('คุณต้องการลบบริษัทนี้หรือไม่?')) return;
    api
      .delete(`/api/admin/delete-company/${companyId}`)
      .then((res) => {
        alert(res.data.message);
        setCompanies((list) => list.filter((c) => c.company_id !== companyId));
      })
      .catch((err) => {
        console.error('❌ เกิดข้อผิดพลาดในการลบบริษัท:', err);
        alert('ไม่สามารถลบได้');
      });
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2]">
      <Header />

      {/* กว้างขึ้น: max-w-screen-2xl + padding กระชับ */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 py-10">
        {/* หัวเรื่อง + ค้นหา (ไม่มีกรอบกล่อง) */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-[#130347]">บริษัทที่ได้รับการอนุมัติ</h1>
            <p className="text-sm text-[#465d71] mt-1">
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

        {/* รายการบริษัท — เพิ่มคอลัมน์บนจอใหญ่เพื่อลดที่ว่างด้านข้าง */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-[#F8FBFF] border border-[#E6F0FF] rounded-2xl p-5 shadow-sm animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-56 bg-gray-200 rounded" />
                      <div className="h-3 w-72 bg-gray-200 rounded" />
                      <div className="h-3 w-64 bg-gray-200 rounded" />
                      <div className="h-3 w-80 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : filtered.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-md p-10 text-center text-[#130347]">
                ไม่มีบริษัทที่ได้รับการอนุมัติ
              </div>
            </div>
          ) : (
            filtered.map((company) => (
              <div
                key={company.company_id}
                className="bg-[#F8FBFF] border border-[#E6F0FF] rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  {company.company_logo ? (
                    <img
                      src={`${API_URL}/uploads/${company.company_logo}`}
                      alt="Logo"
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl border border-[#E6F0FF] bg-white"
                    />
                  ) : (
                    <PlaceholderLogo name={company.company_name} />
                  )}

                  <div className="flex-1 text-[#130347] text-sm space-y-1">
                    <p><strong className="text-[#465d71]">รหัสบริษัท:</strong> {company.company_id}</p>
                    <p><strong className="text-[#465d71]">ชื่อ:</strong> {company.company_name}</p>
                    <p><strong className="text-[#465d71]">ประเภทธุรกิจ:</strong> {company.business_type || '-'}</p>
                    <p><strong className="text-[#465d71]">อีเมล:</strong> {company.contact_email || company.email || '-'}</p>
                    <p><strong className="text-[#465d71]">ผู้ติดต่อ:</strong> {company.contact_name || '-'}  {company.phone_number || ''}</p>
                    <p><strong className="text-[#465d71]">เว็บไซต์:</strong> {company.website || '-'}</p>
                    <p><strong className="text-[#465d71]">ที่อยู่:</strong> {company.address || '-'}</p>

                    {company.google_maps_link &&
                    company.google_maps_link.startsWith('https://www.google.com/maps/embed') ? (
                      <div className="mt-2">
                        <iframe
                          src={company.google_maps_link}
                          width="100%"
                          height="200"
                          className="rounded-xl"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          title={`Google Map ${company.company_name}`}
                        />
                      </div>
                    ) : (
                      <p><strong className="text-[#465d71]">Maps:</strong> ไม่พบลิงก์แผนที่ หรือรูปแบบไม่ถูกต้อง</p>
                    )}

                    <p>
                      <strong className="text-[#465d71]">สร้างเมื่อ:</strong>{' '}
                      {company.created_date
                        ? new Date(company.created_date).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
                        : '-'}
                    </p>
                    <p>
                      <strong className="text-[#465d71]">อัปเดตล่าสุด:</strong>{' '}
                      {company.last_updated
                        ? new Date(company.last_updated).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
                        : '-'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
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

export default DashboardAdminCompanies;
