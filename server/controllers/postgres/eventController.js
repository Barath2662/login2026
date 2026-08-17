const { Op } = require("sequelize");
const eventModel = require("../../models/postgres/eventModel");
const eventCoordinatorModel = require("../../models/postgres/eventCoordinatorModel");
const userModel = require("../../models/postgres/userModel");

const createEvent = async (req, res) => {
  try {
    const event = await eventModel.create(req.body);
    return res.status(201).json({ message: "Event created", event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.findAll({
      order: [["date", "ASC"], ["start_time", "ASC"]],
    });
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await eventModel.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch event", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await eventModel.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.update(req.body);
    return res.json({ message: "Event updated", event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update event", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await eventModel.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.destroy();
    return res.json({ message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};

const assignCoordinator = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { user_id } = req.body;

    const coordinator = await userModel.findOne({
      where: { id: user_id, role: "event_coordinator" },
    });

    if (!coordinator) {
      return res.status(400).json({ message: "User is not an event coordinator" });
    }

    const assignment = await eventCoordinatorModel.create({
      event_id: eventId,
      user_id,
    });

    return res.status(201).json({ message: "Coordinator assigned", assignment });
  } catch (error) {
    return res.status(500).json({ message: "Failed to assign coordinator", error: error.message });
  }
};

const getTimeline = async (req, res) => {
  try {
    const { date } = req.query;
    const where = date ? { date } : {};

    const events = await eventModel.findAll({
      where,
      order: [["start_time", "ASC"]],
    });

    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch timeline", error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  assignCoordinator,
  getTimeline,
};
