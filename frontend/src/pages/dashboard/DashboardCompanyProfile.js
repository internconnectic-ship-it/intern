// src/pages/dashboard/DashboardCompanyProfile.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
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
    axios.get(`http://localhost:5000/api/company/${companyId}`)
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
        const res = await axios.post('http://localhost:5000/api/upload/profile-image', formData);
        logoFilename = res.data.filename;
      }
      const updatedCompany = { ...company, company_logo: logoFilename };
      await axios.put(`http://localhost:5000/api/company/${companyId}`, updatedCompany);
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
        {/* หัวข้ออยู่นอกกล่อง */}
        <h2 className="text-2xl font-bold mb-4">🏢 โปรไฟล์สถานประกอบการ</h2>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* รูปโปรไฟล์ + ปุ่มอัปโหลด */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={
                company.company_logo
                  ? `http://localhost:5000/uploads/${company.company_logo}`
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

          {/* ฟอร์มข้อมูล */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">รหัส</label>
              <input disabled name="company_id" value={company.company_id} className="w-full border rounded px-3 py-2 bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium">ชื่อ</label>
              <input name="company_name" value={company.company_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">ประเภทธุรกิจ</label>
              <input name="business_type" value={company.business_type} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">เว็บไซต์</label>
              <input name="website" value={company.website} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">อีเมลผู้ติดต่อ</label>
              <input name="contact_email" value={company.contact_email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">ชื่อผู้ติดต่อ</label>
              <input name="contact_name" value={company.contact_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">เบอร์โทรศัพท์</label>
              <input name="phone_number" value={company.phone_number} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">ที่อยู่</label>
              <textarea name="address" value={company.address} onChange={handleChange} rows="3" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Google Maps Embed Link</label>
            <label className="block font-medium text-sm text-gray-500">( กดปุ่ม "แชร์" → เลือก "ฝังแผนที่" และคัดลอกลิงก์ที่อยู่ใน iframe src="..." )</label>
            <input
              name="google_maps_link"
              value={company.google_maps_link || ''}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full border rounded px-3 py-2"
            />
            {mapLinkError && (
              <p className="text-red-600 text-sm mt-1">{mapLinkError}</p>
            )}
          </div>

          {company.google_maps_link && company.google_maps_link.startsWith('https://www.google.com/maps/embed') && (
            <iframe
              src={company.google_maps_link}
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen
              loading="lazy"
              title="Google Map"
              className="mt-4"
            ></iframe>
          )}

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
