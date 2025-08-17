import { NavLink } from 'react-router-dom';

const InstructorMenu = () => (
  <>
    <NavLink to="/dashboard/instructor" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600 font-normal'
    }>
      หน้าหลัก
    </NavLink>

    <NavLink to="/instructor/students" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600 font-normal'
    }>
      นิสิต
    </NavLink>

    <NavLink to="/instructor/supervisors" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600 font-normal'
    }>
      อาจารย์นิเทศ
    </NavLink>

    <NavLink to="/instructor/assign" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600 font-normal'
    }>
      เลือกอาจารย์-นิสิต
    </NavLink>

    <NavLink to="/instructor/scores" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600 font-normal'
    }>
      ดูคะแนน
    </NavLink>

    <NavLink to="/instructor/profile" className={({ isActive }) =>
      isActive ? 'font-bold text-purple-700' : 'hover:text-purple-600 font-normal'
    }>
      โปรไฟล์
    </NavLink>
  </>
);

export default InstructorMenu;
