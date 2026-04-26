const ActivityLog = require("../models/activityLog.model");

const logActivity = async ({
  userId = null,
  module = null,
  action = null,
  targetId = null,
  description = null,
  oldData = null,
  newData = null,
}) => {
  try {
    await ActivityLog.create({
      userId,
      module,
      action,
      targetId,
      description,
      oldData,
      newData,
    });
  } catch (error) {
    console.error("Failed to save activity log:", error.message);
  }
};

module.exports = logActivity;
