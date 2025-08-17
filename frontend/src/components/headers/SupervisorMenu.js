import { NavLink } from 'react-router-dom';

const SupervisorMenu = () => (
  <>
    <NavLink to="/dashboard/supervisor" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>หน้าหลัก</NavLink>

    <NavLink to="/supervisor/evaluation" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>ประเมินนิสิต</NavLink>

    <NavLink to="/supervisor/profile" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>โปรไฟล์</NavLink>
  </>
);

export default SupervisorMenu;
