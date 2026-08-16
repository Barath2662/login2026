import { Outlet } from 'react-router-dom';

const JuniorAttendanceLayout = () => {
  return (
    <div className="p-4 text-white">
      <h1>JuniorAttendanceLayout</h1>
      <Outlet />
    </div>
  );
};

export default JuniorAttendanceLayout;
