const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const registrationController = require("../../controllers/postgres/registrationController");

const router = express.Router();

router.get(
  "/",
  verifyJwt,
  allowRoles("admin"),
  registrationController.getAllRegistrations
);

router.post(
  "/",
  verifyJwt,
  allowRoles("student"),
  registrationController.createRegistration
);

router.get(
  "/my",
  verifyJwt,
  allowRoles("student"),
  registrationController.getMyRegistrations
);

router.get(
  "/event/:eventId",
  verifyJwt,
  allowRoles("admin", "event_coordinator", "junior_attendance"),
  registrationController.getEventRegistrations
);

router.put(
  "/:id/cancel",
  verifyJwt,
  allowRoles("student"),
  registrationController.cancelRegistration
);

module.exports = router;
