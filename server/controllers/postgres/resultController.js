const { Result, Event, User } = require("../../models/postgres");

const getAllResults = async (req, res) => {
  try {
    const results = await Result.findAll({
      include: [
        { model: Event, as: 'event', attributes: ['id', 'name', 'category', 'banner_url', 'day', 'start_time', 'end_time'] },
        { model: User, as: 'winner', attributes: ['id', 'name', 'college_name', 'department', 'roll_no'] },
        { model: User, as: 'runner', attributes: ['id', 'name', 'college_name', 'department', 'roll_no'] },
      ],
    });
    return res.json({ status: 'success', data: results });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch results", error: error.message });
  }
};

const getEventResult = async (req, res) => {
  try {
    const result = await Result.findOne({
      where: { event_id: req.params.eventId },
      include: [
        { model: User, as: 'winner', attributes: ['id', 'name', 'college_name', 'department'] },
        { model: User, as: 'runner', attributes: ['id', 'name', 'college_name', 'department'] },
      ],
    });

    return res.json(result || null);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch result", error: error.message });
  }
};

const saveEventResult = async (req, res) => {
  try {
    const { winner_id, runner_id, remarks } = req.body;

    const [result] = await Result.findOrCreate({
      where: { event_id: req.params.eventId },
      defaults: {
        event_id: req.params.eventId,
        winner_id,
        runner_id,
        remarks,
      },
    });

    if (result.winner_id !== winner_id || result.runner_id !== runner_id || result.remarks !== remarks) {
      await result.update({ winner_id, runner_id, remarks });
    }

    return res.json({ message: "Result saved", result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save result", error: error.message });
  }
};

module.exports = {
  getAllResults,
  getEventResult,
  saveEventResult,
};
