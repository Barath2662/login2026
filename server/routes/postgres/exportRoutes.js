const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const exportController = require("../../controllers/postgres/exportController");

const router = express.Router();

router.get(
  "/event/:eventId/students",
  verifyJwt,
  allowRoles("event_coordinator", "admin"),
  exportController.exportEventStudents
);

router.get(
  "/attendance",
  verifyJwt,
  allowRoles("junior_attendance", "admin"),
  exportController.exportAttendance
);

module.exports = router;
