const Dashboard = require("../models/dashboard.model");

const getDashboardStat = async (req, res) => {
  try {
    const stats = await Dashboard.getStat();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStat,
};
