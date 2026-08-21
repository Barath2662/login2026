const { Op } = require("sequelize");
const registrationModel = require("../../models/postgres/registrationModel");
const eventModel = require("../../models/postgres/eventModel");
const paymentModel = require("../../models/postgres/paymentModel");
const userModel = require("../../models/postgres/userModel");
const teamModel = require("../../models/postgres/teamModel");
const teamMemberModel = require("../../models/postgres/teamMemberModel");
const { sendEventRegistrationConfirmation } = require("../../services/emailService");

const createRegistration = async (req, res) => {
  try {
    const student_id = req.user.id;
    const { event_id, team_name, team_members } = req.body;

    // 1. Verify Payment Status
    const payment = await paymentModel.findOne({
      where: { student_id: student_id },
    });

    if (!payment || (payment.status !== "VERIFIED" && payment.status !== "successful" && payment.status !== "PENDING")) {
      return res.status(403).json({ message: "Event registration is locked until you submit your payment reference." });
    }

    // 2. Fetch Event & Validate Existence
    const event = await eventModel.findByPk(event_id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Block direct registration for Star of Login (invite-only for winners)
    if (event.is_flagship || event.name.toLowerCase().includes("star of login")) {
      return res.status(403).json({
        message: "Star of Login is an invite-only flagship event for competition winners. Coordinators will communicate directly with qualified participants."
      });
    }

    // 3. Deadline Check
    if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
      return res.status(400).json({ message: "Registrations for this event are closed." });
    }

    // 4. Max Slots Check
    if (event.max_participants) {
      const currentCount = await registrationModel.count({
        where: { event_id, status: "registered" },
      });
      if (currentCount >= event.max_participants) {
        return res.status(400).json({ message: "Registrations closed — maximum slot limit reached." });
      }
    }

    // 5. Existing Registration Check
    const existing = await registrationModel.findOne({
      where: { student_id: student_id, event_id },
    });

    if (existing && existing.status === "registered") {
      return res.status(409).json({ message: "You are already registered for this event." });
    }

    // 6. Overlap Collision Guard
    const currentRegistrations = await registrationModel.findAll({
      where: {
        student_id: student_id,
        status: "registered",
      },
      include: [{ model: eventModel, as: "event" }],
    });

    let clashingEvent = null;
    const hasOverlap = currentRegistrations.some((reg) => {
      const existingEvt = reg.event;
      if (!existingEvt) return false;

      // Same day check
      if (existingEvt.day === event.day || existingEvt.date === event.date) {
        if (event.start_time < existingEvt.end_time && existingEvt.start_time < event.end_time) {
          clashingEvent = existingEvt;
          return true;
        }
      }
      return false;
    });

    if (hasOverlap && clashingEvent) {
      const dayLabel = event.day ? `${event.day} Sep` : "Same day";
      return res.status(409).json({
        message: `Clashes with ${clashingEvent.name}, ${dayLabel} ${clashingEvent.start_time.slice(0, 5)}–${clashingEvent.end_time.slice(0, 5)}.`,
      });
    }

    // 7. Handle Team Registration if applicable
    let teamRecord = null;
    const cleanTeamName = team_name ? team_name.trim() : null;
    const isTeamEvent = event.team_type === "TEAM" || (event.max_team_size && event.max_team_size > 1);
    const verifiedTeammates = [];

    if (isTeamEvent) {
      if (!cleanTeamName) {
        return res.status(400).json({ message: "Team name is required for team events." });
      }

      const minMembers = event.min_team_size || 2;
      const maxMembers = event.max_team_size || 4;
      const mandatoryExtra = Math.max(1, minMembers - 1);
      const maxExtra = maxMembers - 1;

      const rawMembers = Array.isArray(team_members) ? team_members : [];
      const memberEmails = rawMembers
        .map((m) => (typeof m === "string" ? m.trim().toLowerCase() : m && m.email ? m.email.trim().toLowerCase() : ""))
        .filter(Boolean);

      // Unique emails check
      const uniqueEmails = [...new Set(memberEmails)];
      if (uniqueEmails.length < memberEmails.length) {
        return res.status(400).json({ message: "Duplicate teammate emails are not allowed." });
      }

      if (uniqueEmails.length < mandatoryExtra) {
        return res.status(400).json({
          message: `This event requires a team of ${minMembers}–${maxMembers} members. You must provide at least ${mandatoryExtra} teammate email(s).`,
        });
      }

      if (uniqueEmails.length > maxExtra) {
        return res.status(400).json({
          message: `Maximum allowed additional teammates for this event is ${maxExtra}.`,
        });
      }

      const currentUser = await userModel.findByPk(student_id);

      // Verify each teammate in Database
      for (const teammateEmail of uniqueEmails) {
        if (currentUser && teammateEmail === currentUser.email.toLowerCase()) {
          return res.status(400).json({
            message: "Do not enter your own email as a teammate. You are automatically registered as the Team Leader.",
          });
        }

        const teammateUser = await userModel.findOne({ where: { email: teammateEmail } });
        if (!teammateUser) {
          return res.status(400).json({
            message: `Teammate email '${teammateEmail}' is not registered in LOGIN 2026. All team members must create an account first.`,
          });
        }

        // Check if teammate is already registered
        const teammateExistingReg = await registrationModel.findOne({
          where: { student_id: teammateUser.id, event_id, status: "registered" },
        });

        if (teammateExistingReg) {
          return res.status(409).json({
            message: `Teammate '${teammateUser.name}' (${teammateEmail}) is already registered for this event.`,
          });
        }

        verifiedTeammates.push(teammateUser);
      }

      // Create Team record
      teamRecord = await teamModel.create({
        name: cleanTeamName,
        created_by: student_id,
      });

      // Add leader to team
      await teamMemberModel.create({
        team_id: teamRecord.id,
        student_id: student_id,
      });

      // Add teammates to team and register them for event
      for (const teammate of verifiedTeammates) {
        await teamMemberModel.create({
          team_id: teamRecord.id,
          student_id: teammate.id,
        });

        await registrationModel.create({
          student_id: teammate.id,
          event_id,
          status: "registered",
          team_name: cleanTeamName,
        });

        // Send confirmation email to teammate
        sendEventRegistrationConfirmation(teammate, event, teamRecord);
      }
    }

    // 8. Register Leader
    const registration = existing
      ? await existing.update({ status: "registered", team_name: cleanTeamName })
      : await registrationModel.create({
          student_id: student_id,
          event_id,
          status: "registered",
          team_name: cleanTeamName,
        });

    // 9. Send Confirmation Email to Leader
    const leaderUser = await userModel.findByPk(student_id);
    if (leaderUser) {
      sendEventRegistrationConfirmation(leaderUser, event, teamRecord);
    }

    return res.status(201).json({ message: "Successfully registered for event", registration, event });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to register for event",
      error: error.message,
    });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await registrationModel.findAll({
      where: { student_id: req.user.id, status: "registered" },
      include: [{ model: eventModel, as: "event" }],
      order: [["createdAt", "DESC"]],
    });

    return res.json(registrations);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch registrations",
      error: error.message,
    });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await registrationModel.findAll({
      where: {
        event_id: req.params.eventId,
        status: "registered",
      },
      include: [
        {
          model: userModel,
          as: "student",
          attributes: ["id", "name", "email", "phone", "college_name", "department", "roll_no", "student_id_code"],
        },
      ],
      order: [
        ["team_name", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    return res.json(registrations);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch event registrations",
      error: error.message,
    });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const registration = await registrationModel.findOne({
      where: {
        id: req.params.id,
        student_id: req.user.id,
      },
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    await registration.update({ status: "cancelled" });
    return res.json({ message: "Registration cancelled", registration });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to cancel registration",
      error: error.message,
    });
  }
};

module.exports = {
  createRegistration,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
};
