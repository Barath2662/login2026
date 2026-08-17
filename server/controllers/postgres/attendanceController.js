const attendanceModel = require("../../models/postgres/attendanceModel");

const getEventAttendance = async (req, res) => {
  try {
    const attendance = await attendanceModel.findAll({
      where: { event_id: req.params.eventId },
      order: [["student_id", "ASC"]],
    });

    return res.json(attendance);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch attendance", error: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { event_id, student_id, status } = req.body;

    if (!["present", "absent", "not_marked"].includes(status)) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    const [attendance] = await attendanceModel.findOrCreate({
      where: { event_id, student_id },
      defaults: {
        event_id,
        student_id,
        status,
        marked_by: req.user.id,
        marked_at: new Date(),
      },
    });

    if (attendance.status !== status || attendance.marked_by !== req.user.id) {
      await attendance.update({
        status,
        marked_by: req.user.id,
        marked_at: new Date(),
      });
    }

    return res.json({ message: "Attendance updated", attendance });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update attendance", error: error.message });
  }
};

module.exports = {
  getEventAttendance,
  markAttendance,
};
