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
  allowRoles("admin", "coordinator"),
  userController.getAllUsers
);

router.post(
  "/",
  verifyJwt,
  allowRoles("admin", "coordinator"),
  userController.createUserByAdmin
);


router.put(
  "/:id/details",
  verifyJwt,
  allowRoles("admin"),
  userController.updateUserDetails
);

router.delete(
  "/:id",
  verifyJwt,
  allowRoles("admin"),
  userController.deleteUser
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
