import { NavLink } from 'react-router-dom';

const CompanyMenu = () => (
  <>
    <NavLink to="/dashboard/company" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : ''
    }>หน้าหลัก</NavLink>

    <NavLink to="/company/jobs" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : ''
    }>ประกาศ</NavLink>

    <NavLink to="/company/status" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : ''
    }>สถานะ</NavLink>

    <NavLink to="/company/evaluation" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : ''
    }>ประเมิน</NavLink>

    <NavLink to="/company/profile" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : ''
    }>โปรไฟล์</NavLink>
  </>
);

export default CompanyMenu;
