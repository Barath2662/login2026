import { Outlet } from 'react-router-dom';

const Notifications = () => {
  return (
    <div className="p-4 text-white">
      <h1>Notifications</h1>
      <Outlet />
    </div>
  );
};

export default Notifications;
