const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/postgres/userModel");
const paymentModel = require("../../models/postgres/paymentModel");
const registrationModel = require("../../models/postgres/registrationModel");
const teamModel = require("../../models/postgres/teamModel");
const teamMemberModel = require("../../models/postgres/teamMemberModel");
const { sendEmail } = require("../../services/emailService");

const jwtSecret = process.env.JWT_SECRET || "super_secret_jwt_key_login_2026";

const parseStoredTeamEmails = (value) => {
  if (!value) return [];
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((email) => String(email).trim().toLowerCase()).filter(Boolean);
  } catch (error) {
    return [];
  }
};

const pairPendingTeamInvite = async (userId, email) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  if (!normalizedEmail) return null;

  const teams = await teamModel.findAll();
  let pairedTeam = null;

  for (const team of teams) {
    const pendingEmails = parseStoredTeamEmails(team.member_emails);
    if (!pendingEmails.includes(normalizedEmail)) continue;

    pairedTeam = team;
    await teamMemberModel.findOrCreate({
      where: { team_id: team.id, student_id: userId },
      defaults: { team_id: team.id, student_id: userId, status: "active" },
    });

    const updatedEmails = pendingEmails.filter((item) => item !== normalizedEmail);
    await team.update({ member_emails: JSON.stringify(updatedEmails) });
    break;
  }

  return pairedTeam;
};

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      college_name,
      department,
      roll_no,
      user_type = "PARTICIPANT",
      gender,
      year_of_study,
      batch_year,
      place,
      current_organization,
      accommodation_required = false,
    } = req.body;

    const isAlumni = String(user_type).toUpperCase() === "ALUMNI";

    if (!name || !email || (!isAlumni && !password)) {
      return res.status(400).json({
        message: isAlumni ? "Name and email are required" : "Name, email and password are required",
      });
    }

    if (isAlumni && !/^\d{2}MX$/i.test(String(batch_year || ""))) {
      return res.status(400).json({
        message: "Alumni batch code must use YYMX format, such as 25MX or 95MX",
      });
    }

    const existingUser = await userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const rawPassword = password || `AlumniRSVP_${Math.random().toString(36).slice(-8)}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const normalizedRole = "student";
    const user = await userModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
      college_name,
      department,
      roll_no,
      user_type: user_type.toUpperCase() === "ALUMNI" ? "ALUMNI" : "PARTICIPANT",
      gender,
      year_of_study,
      batch_year,
      place,
      current_organization,
      accommodation_required: Boolean(accommodation_required),
      role: normalizedRole,
    });

    await pairPendingTeamInvite(user.id, user.email);

    const token = jwt.sign(
      {
        id: user.id,
        role: normalizedRole,
        user_type: user.user_type,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college_name: user.college_name,
        department: user.department,
        roll_no: user.roll_no,
        role: user.role,
        user_type: user.user_type,
        student_id_code: user.student_id_code,
        is_active: user.is_active,
        accommodation_required: user.accommodation_required,
        must_change_password: user.must_change_password,
        hasPaidFee: false,
        registrations: [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const normalizedRole = String(user.role || "student").toLowerCase();

    const token = jwt.sign(
      {
        id: user.id,
        role: normalizedRole,
        user_type: user.user_type,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const payment = await paymentModel.findOne({
      where: { student_id: user.id, status: ["PENDING", "VERIFIED"] }
    });

    const registrations = await registrationModel.findAll({
      where: { student_id: user.id }
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college_name: user.college_name,
        department: user.department,
        roll_no: user.roll_no,
        role: user.role,
        user_type: user.user_type,
        student_id_code: user.student_id_code,
        is_active: user.is_active,
        accommodation_required: user.accommodation_required,
        must_change_password: user.must_change_password,
        hasPaidFee: !!payment,
        registrations: registrations.map(r => ({ worldId: r.event_id })),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({ message: "If account exists, password reset token has been sent to email." });
    }

    const resetToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1h" });
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "[LOGIN 2026] Password Reset Token",
      html: `<p>Hello ${user.name},</p><p>You requested a password reset. Click below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return res.status(200).json({
      message: "Password reset instructions sent to your email",
      token: resetToken, // Returned for dev testing convenience
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to request password reset", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await userModel.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.must_change_password = false;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await userModel.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (currentPassword) {
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(400).json({ message: "Current password does not match" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.must_change_password = false;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
};
