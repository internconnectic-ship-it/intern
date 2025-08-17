import { NavLink } from 'react-router-dom';

const StudentMenu = () => (
  <div className="flex gap-4 text-indigo-700 font-medium">
    <NavLink to="/dashboard/student" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>หน้าหลัก</NavLink>

    <NavLink to="/student/status" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>สถานะ</NavLink>

    <NavLink to="/student/profile" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>โปรไฟล์</NavLink>
  </div>
);

export default StudentMenu;
