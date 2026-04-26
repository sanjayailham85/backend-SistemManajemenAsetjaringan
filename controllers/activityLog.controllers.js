const ActivityLog = require("../models/activityLog.model");

const getRecent = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const logs = await ActivityLog.getRecent(limit);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error getting recent activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const logs = await ActivityLog.getAll();

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error getting activity logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getRecent,
  getAll,
};
