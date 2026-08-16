const { Op } = require("sequelize");
const teamModel = require("../../models/postgres/teamModel");
const teamMemberModel = require("../../models/postgres/teamMemberModel");
const teamRequestModel = require("../../models/postgres/teamRequestModel");
const userModel = require("../../models/postgres/userModel");

const listStudents = async (req, res) => {
  try {
    const search = req.query.search || "";

    const students = await userModel.findAll({
      where: {
        role: "student",
        is_active: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { college_name: { [Op.iLike]: `%${search}%` } },
          { department: { [Op.iLike]: `%${search}%` } },
          { roll_no: { [Op.iLike]: `%${search}%` } },
        ],
      },
      attributes: ["id", "name", "college_name", "department", "roll_no"],
      order: [["name", "ASC"]],
    });

    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, studentId } = req.body;

    const team = await teamModel.create({
      name: name || `Team-${studentId}`,
      created_by: studentId,
    });

    await teamMemberModel.create({
      team_id: team.id,
      student_id: studentId,
    });

    return res.status(201).json({ message: "Team created", team });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create team", error: error.message });
  }
};

const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    console.log(req.body);
    const { receiver_id, team_id } = req.body;

    if (senderId === Number(receiver_id)) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    const receiver = await userModel.findOne({
      where: { id: receiver_id, role: "student", is_active: true },
    });

    if (!receiver) {
      return res.status(404).json({ message: "Registered student not found" });
    }

    const existing = await teamRequestModel.findOne({
      where: {
        sender_id: senderId,
        receiver_id,
        team_id,
        status: "pending",
      },
    });

    if (existing) {
      return res.status(409).json({ message: "Request already pending" });
    }

    const request = await teamRequestModel.create({
      sender_id: senderId,
      receiver_id,
      team_id
    });

    return res.status(201).json({ message: "Team request sent", request });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send team request", error: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await teamRequestModel.findAll({
      where: {
        [Op.or]: [
          { sender_id: req.user.id },
          { receiver_id: req.user.id },
        ],
      },
      include: [
        { model: userModel, as: "sender", attributes: ["id", "name", "college_name", "department"] },
        { model: userModel, as: "receiver", attributes: ["id", "name", "college_name", "department"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch team requests", error: error.message });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const request = await teamRequestModel.findOne({
      where: {
        id: req.params.id,
        receiver_id: req.user.id,
        status: "pending",
      },
    });

    if (!request) {
      return res.status(404).json({ message: "Pending request not found" });
    }

    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected" });
    }

    await request.update({ status });

    if(status=="accepted"){
      await teamMemberModel.create({
      team_id: request.team_id,
      student_id: req.user.id,
    });
    }

    return res.json({ message: `Request ${status}`, request });
  } catch (error) {
    return res.status(500).json({ message: "Failed to respond to request", error: error.message });
  }
};

const getMyTeam = async (req, res) => {
  try {
    const membership = await teamMemberModel.findOne({
      where: { student_id: req.user.id, status: "active" },
      include: [{ model: teamModel, as: "team" }],
    });

    return res.json(membership || null);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch team", error: error.message });
  }
};

module.exports = {
  listStudents,
  createTeam,
  sendRequest,
  getRequests,
  respondToRequest,
  getMyTeam,
};
