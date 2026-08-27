const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const teamController = require("../../controllers/postgres/teamController");

const router = express.Router();

// Search participants
router.get("/students", verifyJwt, allowRoles("student"), teamController.listStudents);

// Team CRUD
router.post("/", verifyJwt, allowRoles("student"), teamController.createTeam);
router.get("/my", verifyJwt, allowRoles("student"), teamController.getMyTeams);
router.get("/event/:eventId", verifyJwt, allowRoles("student"), teamController.getEventTeams);
router.get("/:teamId", verifyJwt, allowRoles("student"), teamController.getTeamDetails);

// Team Invitations (Leader invites participant)
router.post("/:teamId/invite", verifyJwt, allowRoles("student"), teamController.inviteMember);
router.get("/invitations/my", verifyJwt, allowRoles("student"), teamController.getMyInvitations);
router.put("/invitations/:id", verifyJwt, allowRoles("student"), teamController.respondToInvitation);

// Join Requests (Participant requests to join)
router.post("/:teamId/join-request", verifyJwt, allowRoles("student"), teamController.sendJoinRequest);
router.get("/join-requests/my", verifyJwt, allowRoles("student"), teamController.getMyJoinRequests);
router.put("/join-requests/:id", verifyJwt, allowRoles("student"), teamController.respondToJoinRequest);

// Team Registration & Member Management
router.post("/:teamId/register", verifyJwt, allowRoles("student"), teamController.registerTeamForEvent);
router.delete("/:teamId/members/:userId", verifyJwt, allowRoles("student"), teamController.removeMember);

module.exports = router;
