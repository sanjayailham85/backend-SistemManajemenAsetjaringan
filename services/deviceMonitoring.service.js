const Host = require("../models/host.model");
const Physical = require("../models/physical.model");
const Guest = require("../models/guest.model");
const Switch = require("../models/switch.model");
const Router = require("../models/router.model");
const CCTV = require("../models/cctv.model");
const AccessPoint = require("../models/accessPoint.model");

const buildMonitoringData = (device) => {
  return {
    id: device.id,
    name: device.name,
    ip: device.ip,
    category: device.category,
    status: device.status || "offline",
    monitoringStatus: device.monitoringStatus || "offline",
    ping: null,
    lastSeen: device.updatedAt || null,
  };
};

const getAllDevicesMonitoringService = async () => {
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

  return allDevices.map(buildMonitoringData);
};

module.exports = { getAllDevicesMonitoringService };
