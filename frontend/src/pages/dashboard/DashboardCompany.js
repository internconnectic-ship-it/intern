import React, { useEffect, useState } from 'react';
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const DashboardCompany = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const company_id = localStorage.getItem('companyId');
    if (!company_id) {
      alert("ไม่พบ companyId กรุณาเข้าสู่ระบบใหม่");
      return;
    }
    try {
      const res = await api.get(`/api/job_posting/company/${company_id}`);
      setJobPosts(res.data);
    } catch (err) {
      console.error("❌ ไม่สามารถโหลดข้อมูลประกาศงาน:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('คุณต้องการลบประกาศนี้หรือไม่?')) return;
    try {
      await api.delete(`/api/job_posting/${jobId}`);
      alert('✅ ลบประกาศสำเร็จ');
      fetchJobs();
    } catch (err) {
      console.error('❌ ลบล้มเหลว:', err);
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message);
      } else {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/job_posting/${editingJob.job_posting_id}`, formData);
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error('❌ แก้ไขล้มเหลว:', err);
      alert('เกิดข้อผิดพลาดในการแก้ไข');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#063D8C]">
      <Header />

      <div className="w-[88%] mx-auto py-6">
        {/* หัวเรื่อง */}
        <h1 className="text-2xl font-extrabold text-[#130347] mb-6">
          ประกาศงานของคุณ
        </h1>

        {/* การ์ดรายการประกาศ */}
        {jobPosts.length === 0 ? (
          <p className="text-[#465d71]">🔎 ยังไม่มีประกาศงาน หรือกำลังโหลด...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {jobPosts.map((job) => (
              <div
                key={job.job_posting_id}
                className="p-5 border border-[#E6F0FF] rounded-xl bg-[#F8FBFF] shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <p className="font-bold text-lg text-[#130347] mb-1">📄 {job.position}</p>
                  <p className="text-sm text-[#465d71]"><strong>รายละเอียด:</strong> {job.job_description}</p>
                  <p className="text-sm text-[#465d71]"><strong>คุณสมบัติ:</strong> {job.requirements}</p>
                  <p className="text-sm text-[#465d71]"><strong>ค่าตอบแทน:</strong> {job.compensation} บาท/เดือน</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-[#225EC4] hover:bg-[#1b55b5] text-white px-4 py-2 rounded-full text-sm"
                    onClick={() => navigate(`/job-detail/${job.job_posting_id}`)}
                  >
                    รายละเอียด
                  </button>
                  <button
                    className="bg-[#6EC7E2] hover:bg-[#4bbad8] text-white px-4 py-2 rounded-full text-sm"
                    onClick={() => navigate(`/job-edit/${job.job_posting_id}`)}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-sm"
                    onClick={() => handleDelete(job.job_posting_id)}
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ฟอร์มแก้ไข */}
        {editingJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white text-[#063D8C] p-6 rounded-2xl shadow-lg w-full max-w-2xl"
            >
              <h2 className="text-xl font-bold mb-4">✏️ แก้ไขประกาศงาน</h2>
              {[
                { name: 'position', label: 'ตำแหน่ง' },
                { name: 'job_description', label: 'รายละเอียดงาน' },
                { name: 'requirements', label: 'คุณสมบัติ' },
                { name: 'compensation', label: 'ค่าตอบแทน', type: 'number' },
                { name: 'start_date', label: 'วันที่เริ่ม', type: 'date' },
                { name: 'end_date', label: 'วันที่สิ้นสุด', type: 'date' }
              ].map(({ name, label, type = 'text' }) => (
                <div className="mb-4" key={name}>
                  <label className="block font-semibold text-[#225EC4] mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={type === 'date' ? (formData[name]?.slice(0, 10) || '') : (formData[name] || '')}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E6F0FF] bg-[#F8FBFF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#6EC7E2]"
                    required
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-[#225EC4] hover:bg-[#1b55b5] text-white px-4 py-2 rounded-full"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCompany;
