import { Outlet } from 'react-router-dom';

const SpecialUserLayout = () => {
  return (
    <div className="text-white">
      <Outlet />
    </div>
  );
};

export default SpecialUserLayout;
