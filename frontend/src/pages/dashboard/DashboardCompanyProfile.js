// src/pages/dashboard/DashboardCompanyProfile.jsx
import { useEffect, useState } from 'react';
import api from "../../axios";
import Header from '../../components/Header';

const DashboardCompanyProfile = () => {
  const [company, setCompany] = useState({
    company_id: '',
    company_name: '',
    business_type: '',
    website: '',
    contact_email: '',
    contact_name: '',
    phone_number: '',
    address: '',
    google_maps_link: '',
    company_logo: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [mapLinkError, setMapLinkError] = useState('');
  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    api.get(`/api/company/${companyId}`)
      .then(res => setCompany(res.data))
      .catch(err => console.error('❌ โหลดข้อมูลล้มเหลว:', err));
  }, [companyId]);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSave = async () => {
    if (!company.company_name || !company.contact_name || !company.contact_email) {
      alert('❌ กรุณากรอกข้อมูลให้ครบถ้วน เช่น ชื่อบริษัท ชื่อผู้ติดต่อ และอีเมล');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(company.contact_email)) {
      alert('❌ กรุณากรอกอีเมลผู้ติดต่อให้ถูกต้อง');
      return;
    }
    if (company.website) {
      try { new URL(company.website); }
      catch { alert('❌ URL เว็บไซต์ไม่ถูกต้อง'); return; }
    }
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(company.phone_number)) {
      alert('❌ เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น');
      return;
    }
    if (
      company.google_maps_link &&
      !company.google_maps_link.startsWith('https://www.google.com/maps/embed')
    ) {
      setMapLinkError('❌ กรุณากรอกลิงก์ Embed ของ Google Maps');
      return;
    } else {
      setMapLinkError('');
    }

    try {
      let logoFilename = company.company_logo;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const res = await api.post('/api/upload/profile-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        logoFilename = res.data.filename;
      }
      const updatedCompany = { ...company, company_logo: logoFilename };
      await api.put(`/api/company/${companyId}`, updatedCompany);
      localStorage.setItem('company_logo', logoFilename);
      alert('✅ บันทึกข้อมูลสำเร็จ');
    } catch (err) {
      console.error('❌ บันทึกล้มเหลว:', err);
      alert('❌ บันทึกไม่สำเร็จ');
    }
  };

  if (!company) return <p className="p-6 text-center text-white">⏳ กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#130347]">
      <Header />
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">🏢 โปรไฟล์สถานประกอบการ</h2>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={
                company.company_logo
                  ? `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/${company.company_logo}`
                  : '/default-profile.png'
              }
              alt="โลโก้บริษัท"
              className="w-20 h-20 rounded-full object-cover border-4 border-[#6EC7E2]"
            />
            <div>
              <label className="block text-sm font-medium mb-1">อัปโหลดโลโก้บริษัท</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>

          {/* ...ฟอร์มเหมือนเดิม... */}

          <button
            onClick={handleSave}
            className="w-full mt-6 py-2 rounded text-white bg-[#225EC4] hover:bg-[#063D8C]"
          >
            💾 บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCompanyProfile;
