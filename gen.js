const fs = require('fs');
const path = require('path');

const files = [
  'src/layouts/PublicLayout.jsx',
  'src/layouts/StudentLayout.jsx',
  'src/layouts/CoordinatorLayout.jsx',
  'src/layouts/JuniorAttendanceLayout.jsx',
  'src/layouts/SpecialUserLayout.jsx',
  'src/layouts/AdminLayout.jsx',
  'src/pages/public/Home.jsx',
  'src/pages/public/Events.jsx',
  'src/pages/public/About.jsx',
  'src/pages/public/Contact.jsx',
  'src/pages/public/Register.jsx',
  'src/pages/public/Login.jsx',
  'src/pages/student/StudentDashboard.jsx',
  'src/pages/student/Payment.jsx',
  'src/pages/student/Events.jsx',
  'src/pages/student/RegisteredEvents.jsx',
  'src/pages/student/Team.jsx',
  'src/pages/student/Profile.jsx',
  'src/pages/student/Notifications.jsx',
  'src/pages/coordinator/EventDashboard.jsx',
  'src/pages/coordinator/EventStudents.jsx',
  'src/pages/coordinator/EventAttendance.jsx',
  'src/pages/coordinator/EventResults.jsx',
  'src/pages/junior-attendance/JuniorAttendanceDashboard.jsx',
  'src/pages/special-user/PaymentVerification.jsx',
  'src/pages/admin/AdminDashboard.jsx'
];

files.forEach(f => {
  const p = path.join(__dirname, 'client', f);
  const name = path.basename(f, '.jsx');
  let content = `import { Outlet } from 'react-router-dom';\n\nconst ${name} = () => {\n  return (\n    <div className="p-4 text-white">\n      <h1>${name}</h1>\n      <Outlet />\n    </div>\n  );\n};\n\nexport default ${name};\n`;
  if(!fs.existsSync(path.dirname(p))) fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
});
