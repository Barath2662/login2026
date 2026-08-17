const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const settingController = require("../../controllers/postgres/settingController");

const router = express.Router();

router.get("/", settingController.getSettings);
router.put("/", verifyJwt, allowRoles("admin"), settingController.updateSettings);

module.exports = router;
