import { Outlet } from 'react-router-dom';

const PublicLayout = ({ children }) => {
  return (
    <div className="w-full relative">
      {children || <Outlet />}
    </div>
  );
};

export default PublicLayout;
