const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
