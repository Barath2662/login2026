const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const attendanceController = require("../../controllers/postgres/attendanceController");

const router = express.Router();

router.get(
  "/event/:eventId",
  verifyJwt,
  allowRoles("event_coordinator", "junior_attendance", "admin"),
  attendanceController.getEventAttendance
);

router.post(
  "/",
  verifyJwt,
  allowRoles("event_coordinator", "junior_attendance", "admin"),
  attendanceController.markAttendance
);

module.exports = router;
