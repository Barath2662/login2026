const express = require("express");

const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");

const userController = require("../../controllers/postgres/userController");

const router = express.Router();


router.get(
  "/profile",
  verifyJwt,
  userController.getMyProfile
);


router.put(
  "/profile",
  verifyJwt,
  allowRoles("student"),
  userController.updateMyProfile
);


router.get(
  "/",
  verifyJwt,
  allowRoles("admin", "super_admin", "admin_power"),
  userController.getAllUsers
);


router.get(
  "/:id",
  verifyJwt,
  allowRoles("admin", "super_admin", "admin_power"),
  userController.getUserById
);


router.put(
  "/:id/role",
  verifyJwt,
  allowRoles("super_admin", "admin_power"),
  userController.updateUserRole
);


router.put(
  "/:id/status",
  verifyJwt,
  allowRoles("admin", "super_admin", "admin_power"),
  userController.updateUserStatus
);


module.exports = router;
