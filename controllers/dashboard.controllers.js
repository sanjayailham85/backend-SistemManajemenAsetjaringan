const Dashboard = require("../models/dashboard.model");

const getDashboardSummary = async (req, res) => {
  try {
    const data = await Dashboard.getSummary();

    res.status(200).json({
      racks: data.racks,
      physical: data.physical,
      host: data.host,
      guest: data.guest,

      // =========================
      // DEVICE (SUDAH DIGABUNG)
      // =========================
      devices: data.devices,

      totalDevices: data.totalDevices,

      // STATUS
      deviceStatus: data.deviceStatus,
      deviceStatusPerDevice: data.deviceStatusPerDevice,

      // MERK
      cctvByMerk: data.cctvByMerk,
      accessPointByMerk: data.accessPointByMerk,
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
