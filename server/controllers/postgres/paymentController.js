const paymentModel = require("../../models/postgres/paymentModel");
const userModel = require("../../models/postgres/userModel");
const { sendPaymentVerificationEmail } = require("../../services/emailService");

const generateStudentIdCode = async (userId) => {
  const paddedId = String(userId).padStart(4, "0");
  return `LGN26-${paddedId}`;
};

const getMyPayment = async (req, res) => {
  try {
    const payment = await paymentModel.findOne({
      where: { student_id: req.user.id },
    });

    const user = await userModel.findByPk(req.user.id);

    return res.json(
      payment || {
        amount: 150,
        status: "NOT_SUBMITTED",
        student_id_code: user ? user.student_id_code : null,
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch payment", error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { transaction_reference, receipt_url } = req.body;

    if (!transaction_reference || !transaction_reference.trim()) {
      return res.status(400).json({ message: "Transaction reference is required" });
    }

    const trimmedRef = transaction_reference.trim();

    // Check if transaction_reference is already used by another user
    const existingRef = await paymentModel.findOne({
      where: { transaction_reference: trimmedRef },
    });

    if (existingRef && existingRef.student_id !== req.user.id) {
      return res.status(409).json({ message: "This transaction reference number has already been submitted by another account." });
    }

    if (!existingRef && trimmedRef.length < 4) {
      return res.status(400).json({ message: "Transaction reference looks incomplete. Please verify the UTR or reference number." });
    }

    const existing = await paymentModel.findOne({
      where: { student_id: req.user.id },
    });

    if (existing && existing.status === "VERIFIED") {
      return res.status(409).json({
        message: "Payment already verified",
        payment: existing,
      });
    }

    const payment = existing
      ? await existing.update({
          amount: 150,
          transaction_reference: trimmedRef,
          receipt_url: receipt_url || existing.receipt_url,
          status: "PENDING",
          rejection_reason: null,
        })
      : await paymentModel.create({
          student_id: req.user.id,
          amount: 150,
          transaction_reference: trimmedRef,
          receipt_url: receipt_url || null,
          status: "PENDING",
        });

    return res.status(201).json({
      message: "Payment reference submitted successfully. Pending admin verification.",
      payment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to submit payment reference",
      error: error.message,
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.findAll({
      include: [
        {
          model: userModel,
          as: "student",
          attributes: ["id", "name", "email", "phone", "college_name", "department", "roll_no", "student_id_code"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch payments", error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const payment = await paymentModel.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const targetStatus = status ? status.toUpperCase() : "VERIFIED";

    if (targetStatus === "VERIFIED") {
      await payment.update({
        status: "VERIFIED",
        verified_by: req.user.id,
        verified_at: new Date(),
        rejection_reason: null,
      });

      // Generate & update official Student ID
      const user = await userModel.findByPk(payment.student_id);
      if (user) {
        if (!user.student_id_code) {
          const studentIdCode = await generateStudentIdCode(user.id);
          user.student_id_code = studentIdCode;
          await user.save();
        }
        sendPaymentVerificationEmail(user, user.student_id_code);
      }
      return res.json({ message: "Payment verified successfully", payment });
    } else if (targetStatus === "REJECTED") {
      const studentId = payment.student_id;
      const registrationModel = require("../../models/postgres/registrationModel");
      
      // Ban/Delete user from system on false UTR
      await registrationModel.destroy({ where: { student_id: studentId } });
      await payment.destroy();
      await userModel.destroy({ where: { id: studentId } });
      
      return res.json({ message: "Payment rejected. Participant provided false UTR and has been banned." });
    } else {
      return res.status(400).json({ message: "Invalid verification status. Must be VERIFIED or REJECTED." });
    }
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
