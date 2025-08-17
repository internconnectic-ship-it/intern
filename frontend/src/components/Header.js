import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import StudentMenu from './headers/StudentMenu';
import CompanyMenu from './headers/CompanyMenu';
import InstructorMenu from './headers/InstructorMenu';
import AdminMenu from './headers/AdminMenu';
import SupervisorMenu from './headers/SupervisorMenu';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Header = () => {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem(`${role}Id`);
  const [profileImage, setProfileImage] = useState("default-profile.png");
  const [userName, setUserName] = useState("ผู้ใช้");
  const navigate = useNavigate();

  useEffect(() => {
    if (role && userId) {
      axios.get(`${API_URL}/api/${role}/${userId}`)
        .then(res => {
          const data = res.data;

          // ✅ ดึงรูปภาพ
          const image =
            role === "company" ? data.company_logo :
            data.profile_image;

          // ✅ ดึงชื่อ
          const name =
            role === "company" ? data.company_name :
            role === "student" ? data.student_name :
            role === "instructor" ? data.Instructor_name :
            role === "supervisor" ? data.supervisor_name :
            role === "admin" ? data.admin_name :
            "ผู้ใช้";

          setProfileImage(image || "default-profile.png");
          setUserName(name || "ผู้ใช้");
        })
        .catch(err => {
          console.error("โหลดข้อมูลผู้ใช้ล้มเหลว:", err);
          setProfileImage("default-profile.png");
        });
    }
  }, [role, userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderMenuByRole = () => {
    switch (role) {
      case "student":
        return <StudentMenu />;
      case "company":
        return <CompanyMenu />;
      case "instructor":
        return <InstructorMenu />;
      case "supervisor":
        return <SupervisorMenu />;
      case "admin":
        return <AdminMenu />;
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white text-indigo-700 shadow-md px-6 py-4 flex justify-between items-center">
      {/* เมนูฝั่งซ้าย */}
      <div className="flex gap-6 font-medium text-lg">
        {renderMenuByRole()}
      </div>

      {/* ข้อมูลผู้ใช้ฝั่งขวา */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          <img
            src={`http://localhost:5000/uploads/${profileImage}`}
            alt="profile"
            className="profile-image"
            width="64"
            height="64"
          />
          <span className="text-sm">{userName}</span>
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 border border-gray-400 rounded hover:bg-red-100 text-sm"
        >
          ออกจากระบบ
        </button>
      </div>
    </nav>
  );
};

export default Header;
