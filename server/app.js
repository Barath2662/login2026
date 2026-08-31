const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const publicUploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(publicUploadsDir)) {
  fs.mkdirSync(publicUploadsDir, { recursive: true });
}

const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  "https://login2026-client.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://frontend:5173",
].filter(Boolean));

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  if (allowedOrigins.has(origin)) return true;

  return (
    origin.includes("login2026-client") &&
    (origin.includes(".vercel.app") || origin.includes("localhost"))
  );
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Express Session setup for MPA Cookie Auth
app.use(
  session({
    secret: process.env.SESSION_SECRET || "login_2k26_super_secret_session_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set true in HTTPS production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Templating Engine setup (EJS + Express Layouts)
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout-ink");

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(publicUploadsDir));

// MPA View Routes (Server-rendered HTML)
app.use("/", require("./routes/views/index"));

// API Routes
app.use("/api/events", require("./routes/postgres/eventRoutes"));
app.use("/api/registrations", require("./routes/postgres/registrationRoutes"));
app.use("/api/payments", require("./routes/postgres/paymentRoutes"));
app.use("/api/teams", require("./routes/postgres/teamRoutes"));
app.use("/api/attendance", require("./routes/postgres/attendanceRoutes"));
app.use("/api/bonafides", require("./routes/postgres/bonafideRoutes"));
app.use("/api/notifications", require("./routes/postgres/notificationRoutes"));
app.use("/api/results", require("./routes/postgres/resultRoutes"));
app.use("/api/users", require("./routes/postgres/userRoutes"));
app.use("/api/exports", require("./routes/postgres/exportRoutes"));
app.use("/api/auth", require("./routes/postgres/authRoutes"));
app.use("/api/announcements", require("./routes/postgres/announcementRoutes"));
app.use("/api/settings", require("./routes/postgres/settingRoutes"));
app.use("/api/stats", require("./routes/postgres/statsRoutes"));
app.use("/api/upload", require("./routes/postgres/uploadRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).render("pages/404", {
    layout: "layouts/layout-ink",
    title: "404 Page Not Found",
    sectionName: "ERROR",
    pageId: "ERR-404",
    user: req.session.user || null,
    announcements: [],
  });
});

module.exports = app;
