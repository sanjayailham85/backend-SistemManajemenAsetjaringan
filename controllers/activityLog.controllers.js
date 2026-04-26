const ActivityLog = require("../models/activityLog.model");

const getRecent = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const logs = await ActivityLog.getRecent(limit);

    res.status(200).json({
      data: logs,
    });
  } catch (error) {
    console.error("Error getting recent activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await ActivityLog.getAll(limit, offset);
    const total = await ActivityLog.getCount();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting activity logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteActivityLogs = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Activity Logs ID is required" });
    }

    const affectedRows = await ActivityLog.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Access Point not found" });
    }

    res.status(200).json({ message: "Access Point deleted" });
  } catch (error) {
    console.error("Error deleting Access Point:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getRecent,
  getAll,
  deleteActivityLogs,
};
