const Notification = require("../models/Notification");

// ====================
// Get Notifications
// ====================

const getNotifications = async (req, res) => {
  try {
    const { householdId } = req.query;

    const filter = {
      recipient: req.user.id,
    };

    if (householdId) {
      filter.household = householdId;
    }

    const notifications = await Notification.find(filter)
      .populate("household", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      ...filter,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      total: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message,
    });
  }
};

// ====================
// Get Unread Count
// ====================

const getUnreadCount = async (req, res) => {
  try {
    const { householdId } = req.query;

    const filter = {
      recipient: req.user.id,
      isRead: false,
    };

    if (householdId) {
      filter.household = householdId;
    }

    const unreadCount = await Notification.countDocuments(filter);

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
      error: error.message,
    });
  }
};

// ====================
// Mark One as Read
// ====================

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user.id,
      },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// ====================
// Mark All as Read
// ====================

const markAllAsRead = async (req, res) => {
  try {
    const { householdId } = req.body;

    const filter = {
      recipient: req.user.id,
      isRead: false,
    };

    if (householdId) {
      filter.household = householdId;
    }

    const result = await Notification.updateMany(filter, {
      $set: { isRead: true },
    });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
