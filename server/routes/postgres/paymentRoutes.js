const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const paymentController = require("../../controllers/postgres/paymentController");

const router = express.Router();

router.get(
  "/my",
  verifyJwt,
  allowRoles("student"),
  paymentController.getMyPayment
);

router.post(
  "/",
  verifyJwt,
  allowRoles("student"),
  paymentController.createPayment
);

router.get(
  "/",
  verifyJwt,
  allowRoles("admin", "special_user"),
  paymentController.getAllPayments
);

router.put(
  "/:id/verify",
  verifyJwt,
  allowRoles("special_user", "admin"),
  paymentController.verifyPayment
);

router.put(
  "/:id/refund",
  verifyJwt,
  allowRoles("special_user", "admin"),
  paymentController.initiateRefund
);

module.exports = router;
