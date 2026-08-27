const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const userModel = require("../../models/postgres/userModel");
const paymentModel = require("../../models/postgres/paymentModel");
const registrationModel = require("../../models/postgres/registrationModel");
const teamModel = require("../../models/postgres/teamModel");
const teamMemberModel = require("../../models/postgres/teamMemberModel");
const { sendEmail } = require("../../services/emailService");

const jwtSecret = process.env.JWT_SECRET || "super_secret_jwt_key_login_2026";

const LOGIN_ID_PREFIX = "LOGIN";
const LOGIN_ID_START = 101;

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
      defaults: { team_id: team.id, student_id: userId, role: "member", status: "accepted" },
    });

    const updatedEmails = pendingEmails.filter((item) => item !== normalizedEmail);
    await team.update({ member_emails: JSON.stringify(updatedEmails) });
    break;
  }

  return pairedTeam;
};

/**
 * Generate the next sequential LOGIN ID.
 * Uses a database transaction and unique constraint to prevent duplicates
 * under concurrent registrations.
 */
const generateLoginId = async (transaction) => {
  const result = await sequelize.query(
    `SELECT login_id FROM users WHERE login_id IS NOT NULL ORDER BY id DESC LIMIT 50`,
    { type: sequelize.constructor.QueryTypes.SELECT, transaction }
  );

  let maxNum = LOGIN_ID_START - 1;
  for (const row of result) {
    const match = row.login_id && row.login_id.match(/^LOGIN(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  return `${LOGIN_ID_PREFIX}${maxNum + 1}`;
};

const buildUserResponse = (user, hasPaidFee, registrations = []) => ({
  id: user.id,
  login_id: user.login_id,
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
  hasPaidFee,
  registrations: registrations.map((r) => ({ worldId: r.event_id })),
});

const registerUser = async (req, res) => {
  const transaction = await sequelize.transaction();
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
      await transaction.rollback();
      return res.status(400).json({
        message: isAlumni ? "Name and email are required" : "Name, email and password are required",
      });
    }

    if (isAlumni && !/^\d{2}MX$/i.test(String(batch_year || ""))) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Alumni batch code must use YYMX format, such as 25MX or 95MX",
      });
    }

    const existingUser = await userModel.findOne({
      where: { email },
      transaction,
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const rawPassword = password || `AlumniRSVP_${Math.random().toString(36).slice(-8)}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Generate unique LOGIN ID
    const loginId = await generateLoginId(transaction);

    const normalizedRole = "student";
    const user = await userModel.create(
      {
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
        login_id: loginId,
      },
      { transaction }
    );

    await transaction.commit();

    await pairPendingTeamInvite(user.id, user.email);

    // Send welcome email with LOGIN ID
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    sendEmail({
      to: user.email,
      subject: `[LOGIN 2026] Welcome! Your Participant ID: ${loginId}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0A0607; color: #F7F2F2; padding: 32px; border-radius: 6px; max-width: 600px; margin: 0 auto; border: 1px solid #2A1A1D;">
          <div style="border-bottom: 2px solid #E01B22; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #E01B22; margin: 0; font-size: 24px; letter-spacing: 2px;">LOGIN 2026</h1>
            <p style="color: #A79798; margin: 6px 0 0 0; font-size: 12px; font-family: monospace;">Department of Computer Applications • PSG College of Technology</p>
          </div>
          <h2 style="color: #F7F2F2; font-size: 20px; margin-top: 0;">Welcome to LOGIN 2026!</h2>
          <p style="color: #A79798; font-size: 14px; line-height: 1.6;">Hello <strong style="color: #F7F2F2;">${user.name}</strong>,</p>
          <p style="color: #A79798; font-size: 14px; line-height: 1.6;">Your participant account has been created successfully.</p>
          <div style="background: #130C0E; border: 2px solid #E01B22; padding: 24px; margin: 24px 0; border-radius: 4px; text-align: center;">
            <p style="color: #A79798; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 2px;">Your Participant ID</p>
            <h2 style="color: #E01B22; font-size: 36px; margin: 0; letter-spacing: 4px; font-family: monospace;">${loginId}</h2>
          </div>
          <p style="color: #A79798; font-size: 14px; line-height: 1.6;">Use this ID along with your password to log in at <a href="${frontendUrl}/login" style="color: #E01B22;">${frontendUrl}/login</a>.</p>
          <p style="color: #6B5A5C; font-size: 12px; margin-top: 24px; border-top: 1px solid #2A1A1D; padding-top: 16px;">
            For assistance, contact the organizing team at <a href="mailto:login@psgtech.ac.in" style="color: #E01B22;">login@psgtech.ac.in</a>.
          </p>
        </div>
      `,
    });

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
      loginId,
      user: buildUserResponse(user, false, []),
    });
  } catch (error) {
    try { await transaction.rollback(); } catch (_) {}
    return res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { loginId, email, password } = req.body;

    // Support dual-mode login: LOGIN ID (primary) or email (fallback for admins)
    if (!loginId && !email) {
      return res.status(400).json({
        message: "LOGIN ID or email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    let user = null;

    // Try LOGIN ID first
    if (loginId) {
      user = await userModel.findOne({
        where: { login_id: loginId.toUpperCase().trim() },
      });
    }

    // Fallback to email if LOGIN ID not provided or not found
    if (!user && email) {
      user = await userModel.findOne({
        where: { email },
      });
    }

    // Also try loginId value as email (backward compat if someone types email in loginId field)
    if (!user && loginId && loginId.includes("@")) {
      user = await userModel.findOne({
        where: { email: loginId.trim() },
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
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
        message: "Invalid credentials",
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
      user: buildUserResponse(user, !!payment, registrations),
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
