const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const teamController = require("../../controllers/postgres/teamController");

const router = express.Router();

router.get(
  "/students",
  verifyJwt,
  allowRoles("student"),
  teamController.listStudents
);

router.post(
  "/",
  verifyJwt,
  allowRoles("student"),
  teamController.createTeam
);

router.get(
  "/my",
  verifyJwt,
  allowRoles("student"),
  teamController.getMyTeam
);

router.post(
  "/requests",
  verifyJwt,
  allowRoles("student"),
  teamController.sendRequest
);

router.get(
  "/requests",
  verifyJwt,
  allowRoles("student"),
  teamController.getRequests
);

router.put(
  "/requests/:id",
  verifyJwt,
  allowRoles("student"),
  teamController.respondToRequest
);

module.exports = router;
