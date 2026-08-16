const paymentModel = require("../../models/postgres/paymentModel");

const getMyPayment = async (req, res) => {
  try {
    const payment = await paymentModel.findOne({
      where: { student_id: req.user.id },
    });

    return res.json(
      payment || {
        amount: 100,
        status: "required",
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch payment", error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const existing = await paymentModel.findOne({
      where: { student_id: req.user.id },
    });

    if (existing && existing.status === "successful") {
      return res.status(409).json({
        message: "Payment already completed",
        payment: existing,
      });
    }

    const payment = existing
      ? await existing.update({
          amount: 100,
          transaction_reference: req.body.transaction_reference,
          status: "in_progress",
        })
      : await paymentModel.create({
          student_id: req.user.id,
          amount: 100,
          transaction_reference: req.body.transaction_reference,
          status: "in_progress",
        });

    return res.status(201).json({
      message: "Payment initiated",
      payment,
      gateway_required: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to initiate payment",
      error: error.message,
    });
  }
};

const userModel = require("../../models/postgres/userModel");

const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.findAll({
      include: [{
        model: userModel,
        as: "student",
        attributes: ["id", "name", "roll_no", "email", "phone"]
      }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch payments", error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const payment = await paymentModel.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.update({
      status: "successful",
      verified_by: req.user.id,
      verified_at: new Date(),
      refund_status: "not_applicable",
    });

    return res.json({ message: "Payment verified", payment });
  } catch (error) {
    return res.status(500).json({ message: "Failed to verify payment", error: error.message });
  }
};

const initiateRefund = async (req, res) => {
  try {
    const payment = await paymentModel.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.update({
      status: "refund_initiated",
      refund_status: "initiated",
      verified_by: req.user.id,
    });

    // Actual refund API integration is intentionally handled separately.
    return res.json({ message: "Refund initiated", payment });
  } catch (error) {
    return res.status(500).json({ message: "Failed to initiate refund", error: error.message });
  }
};

module.exports = {
  getMyPayment,
  createPayment,
  getAllPayments,
  verifyPayment,
  initiateRefund,
};
