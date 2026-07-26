# LOGIN 2K26
> **"The Last Human Standing"**

LOGIN 2K26 is an enterprise-grade, cinematic technical event platform designed for high-concurrency event registration, real-time participant management, seamless ticket payments, and dynamic multiverse event dashboards.

---

## 🚀 Project Overview

The platform provides an immersive experience for participants and administrators alike, serving as the central portal for the annual national technical symposium **LOGIN 2K26**. 

This repository contains the foundation and initial boilerplate code committed to `main` as a clean, scalable starting point for modular development.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Data Fetching & State**: TanStack Query (React Query v5) & Zustand
- **HTTP Client**: Axios
- **Form Handling & Validation**: React Hook Form + Zod
- **Animations & Visuals**: Framer Motion, GSAP, Lottie React (Installed placeholders)
- **Iconography**: React Icons

### Backend
- **Runtime & Framework**: Node.js + Express.js
- **Language**: TypeScript
- **ORM & Database**: Prisma ORM + PostgreSQL
- **Security & Utilities**: Helmet, Compression, Morgan, Cookie Parser, Express Validator, dotenv
- **Auth & Payments**: JWT, Passport Google OAuth, Razorpay SDK, Nodemailer, Multer (Installed placeholders)

---

## 📁 Monorepo Directory Structure

```text
login-2k26/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── README.md
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── animations/
│       ├── components/
│       ├── constants/
│       ├── contexts/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── providers/
│       ├── routes/
│       ├── services/
│       ├── store/
│       ├── styles/
│       ├── types/
│       ├── utils/
│       ├── App.tsx
│       └── main.tsx
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── emails/
│       ├── jobs/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       ├── types/
│       ├── uploads/
│       ├── utils/
│       ├── validators/
│       ├── app.ts
│       └── server.ts
├── .editorconfig
├── .env.example
├── .gitignore
├── .prettierrc
├── commitlint.config.js
├── LICENSE
├── package.json
└── README.md
```

---

## ⚙️ Installation & Quickstart

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **PostgreSQL**: `v15.x` or higher

### Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/chinnaya18/Login_2K26.git
   cd Login_2K26
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   cp .env.example client/.env
   cp .env.example server/.env
   ```

4. **Initialize Prisma Client (Server)**
   ```bash
   cd server
   npx prisma generate
   cd ..
   ```

---

## 📜 Available NPM Scripts

### Monorepo Root
- `npm run dev`: Runs the frontend client development server.
- `npm run dev:server`: Runs the backend Express development server.
- `npm run dev:all`: Runs both client and server concurrently.
- `npm run build`: Builds both client and server applications.
- `npm run lint`: Executes TypeScript type checking across client and server.
- `npm run format`: Formats code across the repository using Prettier.

### Client (`client/`)
- `npm run dev`: Starts Vite dev server on `http://localhost:5173`.
- `npm run build`: Compiles production bundle into `dist/`.
- `npm run preview`: Previews built client locally.
- `npm run lint`: Runs TypeScript compiler without emitting output (`tsc --noEmit`).

### Server (`server/`)
- `npm run dev`: Starts Node server with hot reloading via `tsx dev src/server.ts`.
- `npm run build`: Compiles TypeScript files into `dist/`.
- `npm run start`: Runs compiled JavaScript server from `dist/server.js`.
- `npm run lint`: Runs TypeScript type checking (`tsc --noEmit`).

---

## 🔁 Development Workflow

1. **Branching Strategy**: Create feature branches off `main` following `feature/module-name` format.
2. **Commit Hygiene**: Follow conventional commits (e.g. `feat(auth): add google oauth handler`).
3. **Type Safety**: Maintain zero TypeScript warnings/errors. Run `npm run lint` before committing.

---

## 🔮 Future Modules Roadmap

- **Cinematic Landing Page**: Hero Section, Interactive Timelines, Particle Effects.
- **Authentication**: JWT & OAuth Google Flow with Role-Based Access Control (RBAC).
- **Event Registration**: Team & Individual registration forms.
- **Razorpay Payments**: Integrated Webhooks and Payment Verification pipeline.
- **Multiverse Dashboard**: Participant event schedules, live status feeds.
- **Legacy Gallery**: Historical event highlights.
- **Admin Panel**: Event moderation, ticket scanning, CSV exports.
- **QR Passes**: Encrypted dynamic QR codes for physical entry.
- **Notifications**: In-app toast alerts & transactional SMTP email notifications.
- **Countdown System**: Real-time sync countdown timer for main symposium events.
