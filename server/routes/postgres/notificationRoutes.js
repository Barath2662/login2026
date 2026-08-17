const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const notificationController = require("../../controllers/postgres/notificationController");

const router = express.Router();

router.get(
  "/",
  verifyJwt,
  notificationController.getMyNotifications
);

router.put(
  "/:id/read",
  verifyJwt,
  notificationController.markAsRead
);

router.post(
  "/",
  verifyJwt,
  allowRoles("admin", "special_user"),
  notificationController.createNotification
);

module.exports = router;
