import { NavLink } from 'react-router-dom';

const AdminMenu = () => (
  <>
    <NavLink to="/admin/approvals" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>รออนุมัติ</NavLink>

    <NavLink to="/admin/companies" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>สถานประกอบการ</NavLink>

     <NavLink
      to="/admin/register-user"
      className={({ isActive }) =>
        isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
      }
    >
      สมัครผู้ใช้ใหม่
    </NavLink>

    <NavLink to="/admin/reports" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>รายงาน</NavLink>

    <NavLink to="/admin/profile" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>โปรไฟล์</NavLink>

    {/* <NavLink to="/admin/instructors" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600'
    }>รายชื่อ Instructor</NavLink> */}
  </>
);

export default AdminMenu;
