const userModel = require("../../models/postgres/userModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.findAll({
      attributes: {
        exclude: ["password"],
      },
      order: [["createdAt", "DESC"]],
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

const registrationModel = require("../../models/postgres/registrationModel");

const getMyProfile = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: registrationModel,
          as: "registrations",
        }
      ]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check payment status
    const paymentModel = require("../../models/postgres/paymentModel");
    const payment = await paymentModel.findOne({ where: { student_id: req.user.id } });
    const hasPaidFee = payment ? payment.status === "successful" : false;

    // Attach to response
    const userResponse = user.toJSON();
    userResponse.hasPaidFee = hasPaidFee;

    return res.json(userResponse);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedFields = [
      "name",
      "phone",
      "college_name",
      "department",
      "roll_no",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    await user.update(updates);

    return res.json({
      message: "Profile updated",
      user: {
        ...user.toJSON(),
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedRoles = [
      "student",
      "event_coordinator",
      "junior_attendance",
      "special_user",
      "admin",
    ];

    if (!allowedRoles.includes(req.body.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await user.update({ role: req.body.role });
    return res.json({ message: "User role updated", user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update role", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.params.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        message: "is_active must be a boolean",
      });
    }

    await user.update({
      is_active,
    });

    return res.json({
      message: "User status updated",
      user: {
        ...user.toJSON(),
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getMyProfile,
  updateMyProfile,
  updateUserRole,
  getUserById,
  updateUserRole,
  updateUserStatus
};
