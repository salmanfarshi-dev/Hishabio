const Notification = require("../models/Notification");
const User = require("../models/User");

const createNotification = async ({
  household,
  senderId,
  title,
  message,
  type,
  relatedId = null,
}) => {
  try {
    // Get sender information
    const sender = await User.findById(senderId).select("name");

    const senderName = sender?.name || "A member";

    // Action label based on notification type
    const actionLabels = {
      expense_added: "Added by",
      expense_updated: "Updated by",
      expense_deleted: "Deleted by",
      settlement: "Recorded by",
      member_joined: "Joined",
      member_removed: "Removed by",
    };

    const actionLabel = actionLabels[type] || "By";

    // Add sender name to notification message
    const updatedMessage = `${message} ${actionLabel}: ${senderName}`;

    const members = household.members || [];

    const notifications = members
      .filter((member) => {
        const memberId = member.user?._id || member.user;

        return memberId && memberId.toString() !== senderId.toString();
      })
      .map((member) => ({
        recipient: member.user?._id || member.user,
        household: household._id,
        title,
        message: updatedMessage,
        type,
        relatedId,
      }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error("Notification creation failed:", error.message);
  }
};

module.exports = createNotification;
