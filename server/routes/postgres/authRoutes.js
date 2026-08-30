const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const authController = require("../../controllers/postgres/authController");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/check-email", authController.checkEmail);
router.post("/send-otp", authController.sendOtp);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", verifyJwt, authController.changePassword);

module.exports = router;
