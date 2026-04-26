const Host = require("../models/host.model");
const Physical = require("../models/physical.model");
const Guest = require("../models/guest.model");
const Switch = require("../models/switch.model");
const Router = require("../models/router.model");
const CCTV = require("../models/cctv.model");
const AccessPoint = require("../models/accesspoint.model");

const { buildMonitoringData } = require("../utils/deviceMonitoringService");
const getMonitoringStatus = (status) => {
  switch (status) {
    case "active":
      return "online";
    case "inactive":
      return "offline";
    case "damaged":
      return "warning";
    default:
      return "offline";
  }
};

const getAllDevicesMonitoring = async (req, res) => {
  try {
    const [host, physical, guest, switchDevice, router, cctv, accessPoint] =
      await Promise.all([
        Host.getAll(),
        Physical.getAll(),
        Guest.getAll(),
        Switch.getAll(),
        Router.getAll(),
        CCTV.getAll(),
        AccessPoint.getAll(),
      ]);

    const allDevices = [
      ...host,
      ...physical,
      ...guest,
      ...switchDevice,
      ...router,
      ...cctv,
      ...accessPoint,
    ];

    const result = await Promise.all(allDevices.map(buildMonitoringData));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error monitoring all devices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllDevicesMonitoring };
