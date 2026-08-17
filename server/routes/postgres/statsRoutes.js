const express = require("express");
const statsController = require("../../controllers/postgres/statsController");

const router = express.Router();

router.get("/participants", statsController.getParticipantStats);

module.exports = router;
