const { stringify } = require("csv-stringify/sync");
const registrationModel = require("../../models/postgres/registrationModel");
const attendanceModel = require("../../models/postgres/attendanceModel");
const userModel = require("../../models/postgres/userModel");

const exportEventStudents = async (req, res) => {
  try {
    const registrations = await registrationModel.findAll({
      where: { event_id: req.params.eventId },
      include: [{ model: userModel, as: "student" }],
    });

    const rows = registrations.map((item) => ({
      name: item.student?.name || "",
      email: item.student?.email || "",
      phone: item.student?.phone || "",
      college_name: item.student?.college_name || "",
      department: item.student?.department || "",
      roll_no: item.student?.roll_no || "",
      registration_status: item.status,
    }));

    const csv = stringify(rows, { header: true });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="event-${req.params.eventId}-students.csv"`
    );

    return res.send(csv);
  } catch (error) {
    return res.status(500).json({ message: "Failed to export CSV", error: error.message });
  }
};

const exportAttendance = async (req, res) => {
  try {
    const attendance = await attendanceModel.findAll({
      include: [{ model: userModel, as: "student" }],
      order: [["student_id", "ASC"]],
    });

    const rows = attendance.map((item) => ({
      student_name: item.student?.name || "",
      roll_no: item.student?.roll_no || "",
      event_id: item.event_id,
      status: item.status,
      marked_at: item.marked_at || "",
    }));

    const csv = stringify(rows, { header: true });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="attendance.csv"'
    );

    return res.send(csv);
  } catch (error) {
    return res.status(500).json({ message: "Failed to export attendance", error: error.message });
  }
};

module.exports = {
  exportEventStudents,
  exportAttendance,
};
