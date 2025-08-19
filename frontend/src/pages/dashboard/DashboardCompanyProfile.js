// src/pages/dashboard/DashboardCompanyProfile.jsx
import { useEffect, useState } from 'react';
import api from "../../axios"; // ✅ ใช้ instance แทน axios ตรง ๆ
import Header from '../../components/Header';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const companyId = localStorage.getItem('companyId'); // ตาราง company
  const userId = localStorage.getItem('id');           // ตาราง users

  useEffect(() => {
    if (!companyId) return;
    api.get(`${API_URL}/api/company/${companyId}`)
      .then(res => setCompany(res.data))
      .catch(err => console.error('❌ โหลดข้อมูลล้มเหลว:', err));
  }, [companyId]);

  const handleChange = (e) => setCompany({ ...company, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  const handleImageUpload = (e) => setSelectedFile(e.target.files?.[0] || null);

  const handleSave = async () => {
    // --- validate profile ---
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
        const res = await api.post(`${API_URL}/api/upload/profile-image`, formData);
        logoFilename = res.data.filename;
      }
      const updatedCompany = { ...company, company_logo: logoFilename };
      await api.put(`${API_URL}/api/company/${companyId}`, updatedCompany);
      localStorage.setItem('company_logo', logoFilename);

      // ✅ เปลี่ยนรหัสผ่าน
      if (passwordForm.newPassword) {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          return alert("❌ รหัสผ่านใหม่และยืนยันรหัสไม่ตรงกัน");
        }
        const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPassword.test(passwordForm.newPassword)) {
          return alert("❌ รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และประกอบด้วย:\n- ตัวพิมพ์เล็ก\n- ตัวพิมพ์ใหญ่\n- ตัวเลข\n- อักขระพิเศษ");
        }

        await api.post(`${API_URL}/api/change-password`, {
          id: userId,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        });

        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert("✅ บันทึกข้อมูลและเปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
      } else {
        alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
      }
    } catch (err) {
      console.error('❌ บันทึกล้มเหลว:', err);
      alert(err.response?.data?.message || '❌ บันทึกไม่สำเร็จ');
    }
  };

  if (!company) return <p className="p-6 text-center text-white">⏳ กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#130347]">
      <Header />
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">🏢 โปรไฟล์สถานประกอบการ</h2>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* โลโก้ */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={
                company.company_logo
                  ? company.company_logo
                  : '/default-profile.png'}
              alt="โลโก้บริษัท"
              className="w-20 h-20 rounded-full object-cover border-4 border-[#6EC7E2]"
            />
            <div>
              <label className="block text-sm font-medium mb-1">อัปโหลดโลโก้บริษัท</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>

          {/* ฟอร์มข้อมูลบริษัท */}
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

          {/* Google Maps */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Google Maps Embed Link</label>
            <label className="block font-medium text-sm text-gray-500">( แชร์ → ฝังแผนที่ → คัดลอก src )</label>
            <input
              name="google_maps_link"
              value={company.google_maps_link || ''}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full border rounded px-3 py-2"
            />
            {mapLinkError && <p className="text-red-600 text-sm mt-1">{mapLinkError}</p>}
          </div>
          {company.google_maps_link?.startsWith('https://www.google.com/maps/embed') && (
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

          {/* 🔑 เปลี่ยนรหัสผ่าน */}
          <h2 className="text-lg font-bold text-[#130347] mt-6 mb-2">🔑 เปลี่ยนรหัสผ่าน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">รหัสผ่านปัจจุบัน</label>
              <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">รหัสผ่านใหม่</label>
              <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">ยืนยันรหัสผ่านใหม่</label>
              <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <span className="text-xs text-gray-500">***ถ้าไม่เปลี่ยนรหัสผ่าน ไม่ต้องกรอกช่องนี้***</span>
            </div>
          </div>

          {/* ปุ่มบันทึก */}
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
