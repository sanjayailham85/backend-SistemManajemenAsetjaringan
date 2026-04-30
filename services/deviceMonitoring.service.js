const Host = require("../models/host.model");
const Physical = require("../models/physical.model");
const Switch = require("../models/switch.model");
const Router = require("../models/router.model");
const CCTVController = require("../models/cctvController.model");
const AccessPointController = require("../models/accessPointController.model");

const normalizeCategory = (device, type) => {
  switch (type) {
    case "physical":
      return { category: "Server", subcategory: "physical" };

    case "host":
      return { category: "Server", subcategory: "host" };

    case "switch":
      return { category: "Network", subcategory: "switch" };

    case "router":
      return { category: "Network", subcategory: "router" };

    case "accessPoint":
      return {
        category: "Network",
        subcategory: "accessPoint",
        name: device.name || `AP-${device.ip}`,
      };

    case "cctv":
      return {
        category: "Security",
        subcategory: "cctv",
        name: device.name || `CCTV-${device.ip}`,
      };

    default:
      return { category: "Unknown", subcategory: "unknown" };
  }
};
const buildMonitoringData = (device) => {
  return {
    id: device.id,
    name: device.name,
    ip: device.ip,
    category: device.category,
    subcategory: device.subcategory,
    status: device.status || "offline",
    monitoringStatus: device.monitoringStatus || "offline",
    ping: null,
    lastSeen: device.updatedAt || null,
  };
};

const getAllDevicesMonitoringService = async () => {
  const [host, physical, switchDevice, router, cctv, accessPoint] =
    await Promise.all([
      Host.getAll(),
      Physical.getAll(),
      Switch.getAll(),
      Router.getAll(),
      CCTVController.getAllForMonitoring(),
      AccessPointController.getAllForMonitoring(),
    ]);

  const normalize = (data, type) =>
    data.map((device) => ({
      ...device,
      ...normalizeCategory(device, type),
    }));

  const allDevices = [
    ...normalize(host, "host"),
    ...normalize(physical, "physical"),
    ...normalize(switchDevice, "switch"),
    ...normalize(router, "router"),
    ...normalize(cctv, "cctv"),
    ...normalize(accessPoint, "accessPoint"),
  ];

  return allDevices.map(buildMonitoringData);
};

module.exports = { getAllDevicesMonitoringService };
