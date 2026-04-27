const {
  getAllDevicesMonitoringService,
} = require("../services/deviceMonitoring.service");

const getAllDevicesMonitoring = async (req, res) => {
  try {
    const result = await getAllDevicesMonitoringService();

    res.status(200).json(result);
  } catch (error) {
    console.error("Error monitoring all devices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllDevicesMonitoring };
