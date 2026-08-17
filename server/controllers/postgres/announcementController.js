const announcementModel = require("../../models/postgres/announcementModel");

const getActiveAnnouncements = async (req, res) => {
  try {
    const announcements = await announcementModel.findAll({
      where: { is_active: true },
      order: [["priority", "DESC"], ["createdAt", "DESC"]],
    });
    return res.json(announcements);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch announcements", error: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, message, priority, active_from, active_until, is_active } = req.body;
    const announcement = await announcementModel.create({
      title,
      message,
      priority: priority || "normal",
      active_from,
      active_until,
      is_active: is_active !== undefined ? is_active : true,
    });
    return res.status(201).json({ message: "Announcement created", announcement });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create announcement", error: error.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await announcementModel.findByPk(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });

    await announcement.update(req.body);
    return res.json({ message: "Announcement updated", announcement });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update announcement", error: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await announcementModel.findByPk(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });

    await announcement.destroy();
    return res.json({ message: "Announcement deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete announcement", error: error.message });
  }
};

module.exports = {
  getActiveAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
