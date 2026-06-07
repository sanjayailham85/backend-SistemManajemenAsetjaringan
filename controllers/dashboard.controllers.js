const Dashboard = require("../models/dashboard.model");

const getDashboardSummary = async (req, res) => {
  try {
    const data = await Dashboard.getSummary();

    res.status(200).json({
      racks: data.racks,
      physical: data.physical,
      host: data.host,
      guest: data.guest,

      devices: data.devices,

      totalDevices: data.totalDevices,

      deviceStatus: data.deviceStatus,
      deviceStatusPerDevice: data.deviceStatusPerDevice,

      cctvByMerk: data.cctvByMerk,
      accessPointByMerk: data.accessPointByMerk,
      switchByMerk: data.switchByMerk,
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
