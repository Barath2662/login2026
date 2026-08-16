const resultModel = require("../../models/postgres/resultModel");

const getEventResult = async (req, res) => {
  try {
    const result = await resultModel.findOne({
      where: { event_id: req.params.eventId },
    });

    return res.json(result || null);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch result", error: error.message });
  }
};

const saveEventResult = async (req, res) => {
  try {
    const { winner_id, runner_id, remarks } = req.body;

    const [result] = await resultModel.findOrCreate({
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
  getEventResult,
  saveEventResult,
};
