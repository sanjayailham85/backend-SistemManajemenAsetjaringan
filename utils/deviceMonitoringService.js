const pingDevice = require("../utils/pingDevices");

const buildMonitoringData = async (device) => {
  const pingResult = await pingDevice(device.ip);

  return {
    id: device.id,
    name: device.name,
    ip: device.ip,
    category: device.category,

    status: device.status,

    monitoringStatus: pingResult.alive ? "online" : "offline",

    ping: pingResult.time,
    lastSeen: device.updatedAt || null,
  };
};

module.exports = { buildMonitoringData };
