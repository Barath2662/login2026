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

    if (!payment || (payment.status !== "VERIFIED" && payment.status !== "successful")) {
      return res.status(403).json({ message: "Event registration is locked until your registration payment is verified by admin." });
    }

    // 2. Fetch Event & Validate Existence
    const event = await eventModel.findByPk(event_id);
    if (!event) return res.status(404).json({ message: "Event not found" });

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
    if (event.team_type === "TEAM" && team_name) {
      teamRecord = await teamModel.create({
        name: team_name,
        created_by: student_id,
      });

      await teamMemberModel.create({
        team_id: teamRecord.id,
        student_id: student_id,
      });

      if (Array.isArray(team_members)) {
        for (const member of team_members) {
          if (member.email) {
            const memberUser = await userModel.findOne({ where: { email: member.email } });
            if (memberUser) {
              await teamMemberModel.create({
                team_id: teamRecord.id,
                student_id: memberUser.id,
              });
            }
          }
        }
      }
    }

    // 8. Register
    const registration = existing
      ? await existing.update({ status: "registered" })
      : await registrationModel.create({
          student_id: student_id,
          event_id,
          status: "registered",
        });

    // 9. Send Confirmation Email
    const user = await userModel.findByPk(student_id);
    if (user) {
      sendEventRegistrationConfirmation(user, event, teamRecord);
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
          attributes: ["id", "name", "email", "phone", "college_name", "department", "student_id_code"],
        },
      ],
      order: [["createdAt", "ASC"]],
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
