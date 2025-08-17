// src/pages/JobDetailPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const Chip = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F8FBFF] border border-[#E6F0FF] text-xs font-semibold text-[#130347]">
    {children}
  </span>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-[#E6F0FF] p-5">
    <h3 className="font-bold text-[#130347] mb-2">{title}</h3>
    <div className="text-sm text-[#130347] leading-7 whitespace-pre-line">{children || '-'}</div>
  </div>
);

const toEmbedMap = (raw) => {
  if (!raw) return '';
  const url = raw.trim();
  if (url.startsWith('https://www.google.com/maps/embed')) return url;
  if (url.includes('output=embed')) return url;
  return `https://www.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
};

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromStatusPage = location.state?.fromStatusPage || false;

  const [job, setJob] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const role = localStorage.getItem('role') || '';
    const student_id = localStorage.getItem('studentId') || '';
    setUserRole(role);

    axios
      .get(`http://localhost:5000/api/job_posting/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => {
        alert('ไม่พบข้อมูลประกาศงาน');
        navigate('/dashboard/company');
      });

    if (role === 'student' && student_id) {
      axios
        .get('http://localhost:5000/api/job_posting/check-application', {
          params: { student_id, job_posting_id: id },
        })
        .then((res) => setHasApplied(res.data.applied))
        .catch(() => {});
    }
  }, [id, navigate]);

  const handleApply = async () => {
    const student_id = localStorage.getItem('studentId');
    if (!student_id || !resumeFile) return alert('กรุณาแนบไฟล์ Resume');

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('student_id', student_id);
    formData.append('job_posting_id', id);

    try {
      await axios.post('http://localhost:5000/api/job_posting/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ ส่งใบสมัครสำเร็จแล้ว');
      setShowModal(false);
      setHasApplied(true);
    } catch {
      alert('เกิดข้อผิดพลาดในการสมัคร');
    }
  };

  const mapSrc = useMemo(() => toEmbedMap(job?.google_maps_link || ''), [job?.google_maps_link]);

  if (!job) {
    return (
      <div className="min-h-screen bg-[#9AE5F2]">
        <Header />
        <div className="text-center p-10 text-[#130347]">⏳ กำลังโหลด...</div>
      </div>
    );
  }

  const isOpen = job.end_date ? new Date(job.end_date).getTime() >= Date.now() : true;

  return (
    <div className="min-h-screen bg-[#9AE5F2]">
      <Header />

      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E6F0FF] shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg md:text-xl font-extrabold text-[#130347]">{job.position}</h1>
                <div className="mt-1 text-sm text-[#465d71]">{job.company_name}</div>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="hidden md:inline-flex rounded-full bg-[#F8FBFF] hover:bg-white px-4 py-2 text-sm font-semibold text-[#130347] border border-[#E6F0FF]"
              >
                ← กลับ
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip>{isOpen ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}</Chip>
              {job.business_type && <Chip>หมวดหมู่: {job.business_type}</Chip>}
              {job.max_positions && <Chip>จำนวนรับ {job.max_positions} อัตรา</Chip>}
              {job.compensation && (
                <Chip>ค่าตอบแทน {Number(job.compensation).toLocaleString()} บาท/เดือน</Chip>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6F0FF] p-0 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-b border-[#E6F0FF]">
              <div className="p-4">
                <div className="text-xs text-[#465d71]">วันที่ประกาศ</div>
                <div className="font-semibold text-[#130347]">
                  {job.start_date ? new Date(job.start_date).toLocaleDateString('th-TH') : '-'}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-[#465d71]">สิ้นสุดรับสมัคร</div>
                <div className="font-semibold text-[#130347]">
                  {job.end_date ? new Date(job.end_date).toLocaleDateString('th-TH') : '-'}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-[#465d71]">จำนวนรับ</div>
                <div className="font-semibold text-[#130347]">{job.max_positions ?? '-'}</div>
              </div>
              <div className="p-4">
                <div className="text-xs text-[#465d71]">ค่าตอบแทน</div>
                <div className="font-semibold text-[#130347]">
                  {job.compensation ? `${Number(job.compensation).toLocaleString()} บาท/เดือน` : '-'}
                </div>
              </div>
            </div>
          </div>

          <Section title="ลักษณะงาน">{job.job_description}</Section>
          <Section title="คุณสมบัติผู้สมัคร">{job.requirements}</Section>
          <Section title="สถานที่ปฏิบัติงาน">{job.address}</Section>

          {userRole === 'student' && !fromStatusPage && !hasApplied && (
            <div className="lg:hidden">
              <button
                onClick={() => setShowModal(true)}
                className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 font-semibold shadow"
              >
                สมัครตำแหน่งนี้
              </button>
            </div>
          )}
          {userRole === 'student' && hasApplied && (
            <div className="lg:hidden rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3">
              ✅ คุณได้สมัครงานนี้แล้ว
            </div>
          )}
        </div>

        {/* RIGHT */}
        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="bg-white rounded-2xl border border-[#E6F0FF] shadow-sm p-5">
            <div className="font-semibold text-[#130347]">{job.company_name}</div>
            <div className="text-xs text-[#465d71]">ข้อมูลติดต่อบริษัท</div>

            <div className="mt-3 space-y-1 text-sm text-[#130347]">
              <div>📧 {job.email || '-'}</div>
              <div>📞 {job.phone_number || '-'}</div>
              <div>📍 {job.address || '-'}</div>
            </div>

            <div className="mt-4">
              {userRole === 'company' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/job-edit/${id}`)}
                    className="flex-1 rounded-full bg-[#225EC4] hover:bg-[#1b55b5] text-white px-4 py-2 text-sm font-semibold shadow-sm"
                  >
                    ✏️ แก้ไข
                  </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?')) return;
                      try {
                        await axios.delete(`http://localhost:5000/api/job_posting/${id}`);
                        alert('✅ ลบประกาศเรียบร้อยแล้ว');
                        navigate('/dashboard/company');
                      } catch {
                        alert('เกิดข้อผิดพลาดในการลบ');
                      }
                    }}
                    className="flex-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-sm font-semibold shadow-sm"
                  >
                    🗑️ ลบ
                  </button>
                </div>
              ) : userRole === 'student' && !fromStatusPage && !hasApplied ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 font-semibold shadow-sm"
                >
                  ✅ สมัครตำแหน่งนี้
                </button>
              ) : userRole === 'student' && hasApplied ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-center">
                  ✅ คุณได้สมัครงานนี้แล้ว
                </div>
              ) : null}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6F0FF] shadow-sm p-5">
            <h4 className="font-bold text-[#130347] mb-3">แผนที่</h4>
            
            {mapSrc ? (
              <iframe
                src={mapSrc}
                width="100%"
                height="200"
                className="rounded-xl"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title={`Google Map ${job.company_name || ''}`}
              />
            ) : (
              <p className="text-sm text-[#465d71]">ไม่พบลิงก์แผนที่</p>
            )}
          </div>
        </aside>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#E6F0FF] shadow-lg">
            <h2 className="text-xl font-bold text-[#130347] mb-3 text-center">ส่ง Resume</h2>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="mb-4 w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2] text-[#130347]"
            />
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 font-semibold shadow-sm"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleApply}
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 font-semibold shadow-sm"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
