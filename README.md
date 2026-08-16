# LOGIN 2K26 — Event Management System

A full-stack web application for managing technical symposium event registrations, attendance, payments, and coordinator workflows for **LOGIN 2K26**.

---

## 🗂️ Project Structure

```
Login_2k26_client/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── contexts/        # Auth & app-level context
│       ├── layouts/         # Role-based layout wrappers
│       ├── pages/           # Page components per role
│       │   ├── admin/
│       │   ├── coordinator/
│       │   ├── student/
│       │   ├── special-user/
│       │   ├── junior-attendance/
│       │   └── public/
│       ├── routes/          # React Router config
│       ├── services/        # Axios API service layer
│       └── styles/          # Global CSS & design tokens
└── server/                  # Express.js backend
    ├── config/              # DB configuration
    ├── controllers/postgres/ # Business logic
    ├── middleware/           # Auth & role guards
    ├── models/postgres/      # Sequelize ORM models
    └── routes/postgres/      # Express route definitions
```

---

## 🧑‍💻 Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React 18, Vite, TailwindCSS v4 |
| Backend    | Node.js, Express.js            |
| Database   | PostgreSQL via Sequelize ORM   |
| Auth       | JWT (Bearer token)             |
| Styling    | Tailwind + Custom CSS variables|
| UI Icons   | Lucide React                   |
| Fonts      | Orbitron, Inter (Google Fonts) |

---

## 👥 User Roles

The system supports **5 distinct roles**, each with isolated routes, layouts, and navigation:

| Role                | Route Prefix         | Description |
|---------------------|----------------------|-------------|
| `student`           | `/student`           | Register for events, pay fees, manage team |
| `event_coordinator` | `/event-dashboard`   | Manage assigned events, take attendance, view registrations |
| `admin`             | `/admin`             | Full system access — users, events, payments, reports |
| `special_user`      | `/special-user`      | Verify/refund payment transactions |
| `junior_attendance` | `/junior-attendance` | Mark attendance for the LOGIN inauguration (1st year MCA students only) |

---

## 🔑 Authentication & Navigation

- All logins use the **same login page** with role-based redirection after JWT verification.
- **Students** see a full navbar (Events, Teams, Profile, etc.).
- **Non-student roles** (coordinator, admin, special user, junior attendance) see **only the profile icon** in the header — role-specific navigation is via sidebar menus within their layouts.
- JWT token stored in `localStorage`, sent via `Authorization: Bearer <token>` on every request.

---

## 🗄️ Database Models (Sequelize)

| Model              | Table                | Description |
|--------------------|----------------------|-------------|
| `User`             | `users`              | All system users |
| `Event`            | `events`             | Event definitions |
| `EventCoordinator` | `event_coordinators` | Coordinators assigned to events |
| `Registration`     | `registrations`      | Student event registrations |
| `Payment`          | `payments`           | Registration fee payment records |
| `Bonafide`         | `bonafides`          | Certificate upload + verification |
| `Attendance`       | `attendance`         | Event attendance records |
| `Team`             | `teams`              | Team formation |
| `TeamMember`       | `team_members`       | Team membership |
| `TeamRequest`      | `team_requests`      | Team join invitations |
| `Result`           | `results`            | Competition results per event |
| `Notification`     | `notifications`      | In-app notifications |

### Key Associations (`models/postgres/index.js`)

```
User  ──hasMany──▶  Registration  ──belongsTo──▶  Event
User  ──hasOne───▶  Bonafide
User  ──hasMany──▶  Payment
User  ──hasMany──▶  EventCoordinator  ──belongsTo──▶  Event
User  ──hasMany──▶  Attendance
Event ──hasOne───▶  Result
```

---

## 🌐 API Endpoints

### Auth
| Method | Route           | Access |
|--------|-----------------|--------|
| POST   | `/auth/register`| Public |
| POST   | `/auth/login`   | Public |
| POST   | `/auth/logout`  | Authenticated |

### Events
| Method | Route                        | Access |
|--------|------------------------------|--------|
| GET    | `/events/`                   | Public |
| GET    | `/events/admin/all`          | Admin (includes coordinator names) |
| GET    | `/events/coordinator/my`     | Event Coordinator |
| POST   | `/events/:id/coordinators`   | Admin |

### Registrations
| Method | Route                          | Access |
|--------|--------------------------------|--------|
| POST   | `/registrations/`              | Student |
| GET    | `/registrations/my`            | Student |
| GET    | `/registrations/`              | Admin |
| GET    | `/registrations/event/:eventId`| Admin, Coordinator |

### Payments
| Method | Route                  | Access |
|--------|------------------------|--------|
| GET    | `/payments/my`         | Student |
| POST   | `/payments/`           | Student |
| GET    | `/payments/`           | Admin, Special User |
| PUT    | `/payments/:id/verify` | Admin, Special User |
| PUT    | `/payments/:id/refund` | Admin, Special User |

### Attendance
| Method | Route                           | Access |
|--------|---------------------------------|--------|
| GET    | `/attendance/event/:eventId`    | Coordinator, Junior Attendance, Admin |
| POST   | `/attendance/`                  | Coordinator, Junior Attendance, Admin |

---

## 🔧 Changes Made (Development Log)

### 1. Role-Based Navigation
- Navbar hidden for non-student roles; only the profile icon shown in header.
- `AdminLayout`, `CoordinatorLayout`, `SpecialUserLayout`, `JuniorAttendanceLayout` each have role-specific sidebars.
- Removed leftover `<h1>SpecialUserLayout</h1>` placeholder from `SpecialUserLayout.jsx`.

### 2. Event Coordinator Dashboard (`EventDashboard.jsx`)
- Fetches only events assigned to the logged-in coordinator (`GET /events/coordinator/my`).
- Stats cards (Total Registrations, Verified Bonafides, Pending Verifications, Current Attendance) now populated from **real DB data**.
- Removed `(Est)` labels — counts are exact from DB.
- Fixed broken data fetching (`Promise.allSettled` with raw `.get()` → `Promise.all` with typed API service methods).

### 3. Event Coordinator — Students Page (`EventStudents.jsx`)
- Student list now shows Name, Roll No, Email, Phone, College, Department.
- **Bonafide Status** column reflects real DB status (`VERIFIED`, `PENDING`, `MISSING`) instead of hardcoding everyone as VERIFIED.
- `Verified` checkmark driven by actual bonafide verification from DB.

### 4. Backend: `getEventRegistrations`
- Added eager loading of `User` (as `student`) with: `id, name, email, roll_no, department, college_name, phone, year`.
- Added nested eager loading of `Bonafide` (as `bonafide`) inside student — returns real bonafide status.
- Fixed model imports to use central `models/postgres/index.js` so Sequelize associations and `as` aliases work correctly.

### 5. Backend: `getAllPayments`
- Added eager loading of `User` (as `student`) with: `id, name, roll_no, email, phone`.
- Previously returned raw payment rows with no student data.

### 6. Payment Verification Page (`PaymentVerification.jsx`)
- "Operative Name" column now shows the student's real name and roll number.
- Previously showed only `UID: 1`.

### 7. Admin Dashboard (`AdminDashboard.jsx`)
- Full dashboard with live stats: Total Users, Events, Registrations, Payments.
- All stat cards fetch real counts from the database.

### 8. Admin Coordinators Page (`AdminCoordinators.jsx`)
- Displays coordinator **names** (joined from `users` table) instead of raw `user_id`.
- Uses `GET /events/admin/all` with eagerly loaded coordinator data.

### 9. Admin Registrations Page (`AdminRegistrations.jsx`)
- Registrations show student names and roll numbers via eager-loaded student data.

### 10. New Admin-Specific Backend Endpoints
- `GET /events/admin/all` — All events with coordinator names.
- `GET /registrations/` — All registrations with student details.

### 11. Global CSS Fixes (`globals.css`)
- Added `option { background-color; color }` to fix native `<select>` dropdowns showing with browser-default light grey background in the dark-themed UI.

---

## 🚀 Running the Project

### Backend
```bash
cd server
npm install
# Configure .env with your DB credentials
node server.js
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`, server on `http://localhost:5000`.

---

## ⚙️ Environment Variables (`server/.env`)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=login2k26
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
```

---

## 📋 Notes

- **Junior Attendance** is for marking attendance of **1st year MCA students** at the LOGIN Inauguration — not for event participants.
- **Event Coordinators** can only access events assigned to them via the `event_coordinators` table.
- Bonafide status flow: `uploaded → under_review → verified / rejected`
- Payment status flow: `required → in_progress → successful / refund_initiated`
