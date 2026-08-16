const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

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


// Routes
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
app.use("/api/auth",require("./routes/postgres/authRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
