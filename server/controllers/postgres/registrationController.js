const { Op } = require("sequelize");
const registrationModel = require("../../models/postgres/registrationModel");
const eventModel = require("../../models/postgres/eventModel");
const paymentModel = require("../../models/postgres/paymentModel");

const createRegistration = async (req, res) => {
  try {
    const student_id = req.user.id;
    const {event_id} = req.body;

    const payment = await paymentModel.findOne({
      where: {
        student_id: student_id
      },
    });


    if (!payment) {
      return res.status(403).json({ message: "Complete the one-time payment first" });
    }

    const event = await eventModel.findByPk(event_id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = await registrationModel.findOne({
      where: { student_id: student_id, event_id },
    });

    if (existing && existing.status === "registered") {
      return res.status(409).json({ message: "Already registered for this event" });
    }

    const currentRegistrations = await registrationModel.findAll({
      where: {
        student_id: student_id,
        status: "registered",
      },
      include: [{ model: eventModel, as: "event" }],
    });

    const overlap = currentRegistrations.some((registration) => {
      const selected = registration.event;

      if (selected.date !== event.date) return false;

      return (
        event.start_time < selected.end_time &&
        selected.start_time < event.end_time
      );
    });

    if (overlap) {
      return res.status(409).json({
        message: "Event overlaps with one of your registered events",
      });
    }

    const registration = existing
      ? await existing.update({ status: "registered" })
      : await registrationModel.create({
          student_id: student_id,
          event_id,
          status: "registered",
        });

    return res.status(201).json({ message: "Event registered", registration });
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
      where: { student_id: req.user.id },
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

const { User, Bonafide } = require("../../models/postgres");

const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await registrationModel.findAll({
      where: {
        event_id: req.params.eventId,
        status: "registered",
      },
      include: [{
        model: User,
        as: "student",
        attributes: ["id", "name", "email", "roll_no", "department", "college_name", "phone", "year"],
        include: [{
          model: Bonafide,
          as: "bonafide",
          attributes: ["status"]
        }]
      }],
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

const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await registrationModel.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.json(registrations);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch all registrations",
      error: error.message,
    });
  }
};

module.exports = {
  createRegistration,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
  getAllRegistrations,
};
