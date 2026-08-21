const userModel = require("../../models/postgres/userModel");
const paymentModel = require("../../models/postgres/paymentModel");
const registrationModel = require("../../models/postgres/registrationModel");

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

const getMyProfile = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const payment = await paymentModel.findOne({
      where: { student_id: user.id, status: ["PENDING", "VERIFIED"] }
    });

    const registrations = await registrationModel.findAll({
      where: { student_id: user.id }
    });

    const userData = user.toJSON();
    userData.hasPaidFee = !!payment;
    userData.registrations = registrations.map((r) => ({ worldId: r.event_id }));

    return res.json(userData);
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
      "super_admin",
      "admin_power",
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

const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, role, college_name, department, user_type } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await userModel.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : "9876543210",
      password: hashedPassword,
      role: role || "admin",
      college_name: college_name ? college_name.trim() : "PSG College of Technology",
      department: department ? department.trim() : "Computer Applications",
      user_type: user_type || "PARTICIPANT",
      must_change_password: false,
    });

    const paddedId = String(newUser.id).padStart(4, "0");
    const student_id_code = `LGN26-${paddedId}`;
    await newUser.update({ student_id_code });

    if (role && role !== "student") {
      await paymentModel.findOrCreate({
        where: { student_id: newUser.id },
        defaults: {
          student_id: newUser.id,
          amount: 150,
          transaction_reference: `PSG-DESK-${paddedId}`,
          status: "VERIFIED",
        },
      });
    }

    return res.status(201).json({
      message: "User created successfully",
      user: {
        ...newUser.toJSON(),
        student_id_code,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getMyProfile,
  updateMyProfile,
  updateUserRole,
  getUserById,
  updateUserStatus,
  createUserByAdmin,
};

