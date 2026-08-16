import { Outlet } from 'react-router-dom';

const StudentLayout = ({ children }) => {
  return (
    <div className="w-full relative">
      {children || <Outlet />}
    </div>
  );
};

export default StudentLayout;
