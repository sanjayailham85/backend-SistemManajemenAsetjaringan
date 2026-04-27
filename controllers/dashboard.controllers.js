const Dashboard = require("../models/dashboard.model");

const getDashboardSummary = async (req, res) => {
  try {
    const data = await Dashboard.getSummary();

    const totalStatus =
      data.networkDevices.reduce((sum, item) => sum + item.value, 0) +
      data.securityDevices.reduce((sum, item) => sum + item.value, 0);

    res.status(200).json({
      racks: data.racks,
      physical: data.physical,
      host: data.host,
      guest: data.guest,
      networkDevices: data.networkDevices,
      securityDevices: data.securityDevices,
      deviceStatus: data.deviceStatus,
      totalDevices: totalStatus,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: "Failed to load dashboard summary",
    });
  }
};

module.exports = {
  getDashboardSummary,
};
