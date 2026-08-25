const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const verifyEventCoordinatorAccess = require("../../middleware/eventCoordinatorAccess");
const registrationController = require("../../controllers/postgres/registrationController");

const router = express.Router();

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
  verifyEventCoordinatorAccess,
  registrationController.getEventRegistrations
);

router.put(
  "/:id/cancel",
  verifyJwt,
  allowRoles("student"),
  registrationController.cancelRegistration
);

module.exports = router;
