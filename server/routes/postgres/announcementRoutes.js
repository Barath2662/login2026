const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const announcementController = require("../../controllers/postgres/announcementController");

const router = express.Router();

router.get("/", announcementController.getActiveAnnouncements);
router.post("/", verifyJwt, allowRoles("admin"), announcementController.createAnnouncement);
router.put("/:id", verifyJwt, allowRoles("admin"), announcementController.updateAnnouncement);
router.delete("/:id", verifyJwt, allowRoles("admin"), announcementController.deleteAnnouncement);

module.exports = router;
