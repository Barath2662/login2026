const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const resultController = require("../../controllers/postgres/resultController");

const router = express.Router();

router.get(
  "/event/:eventId",
  verifyJwt,
  resultController.getEventResult
);

router.put(
  "/event/:eventId",
  verifyJwt,
  allowRoles("event_coordinator", "admin"),
  resultController.saveEventResult
);

module.exports = router;
