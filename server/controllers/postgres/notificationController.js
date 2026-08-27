const notificationModel = require("../../models/postgres/notificationModel");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationModel.count({
      where: { user_id: req.user.id, is_read: false },
    });

    return res.json({ count });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch unread count", error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationModel.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    await notification.update({ is_read: true });
    return res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update notification", error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await notificationModel.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } }
    );

    return res.json({ message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update notifications", error: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const notification = await notificationModel.create(req.body);
    return res.status(201).json({ message: "Notification created", notification });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create notification", error: error.message });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
};
