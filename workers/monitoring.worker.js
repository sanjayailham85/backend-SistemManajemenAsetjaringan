const {
  getAllDevicesMonitoringService,
} = require("../services/deviceMonitoring.service");
const { pingDevice } = require("../utils/pingDevices");
const { getIO } = require("../utils/sockets");

let devicesFromDB = [];
let deviceStatusMap = new Map();

const REFRESH_INTERVAL = 60000;
const MONITOR_INTERVAL = 10000;
const CONCURRENT_LIMIT = 10;

const refreshDevices = async () => {
  try {
    const devices = await getAllDevicesMonitoringService();
    devicesFromDB = devices;

    console.log("Devices refreshed:", devicesFromDB.length);
  } catch (err) {
    console.error("Refresh devices error:", err.message);
  }
};

const runMonitoring = async () => {
  try {
    const io = getIO();
    if (!io) return;

    if (!devicesFromDB.length) return;

    const changedDevices = [];

    const batches = chunkArray(devicesFromDB, CONCURRENT_LIMIT);

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (device) => {
          const result = await pingDevice(device.ip);

          let newStatus = "offline";

          if (result.alive) {
            newStatus = result.time && result.time > 30 ? "warning" : "online";
          }

          const prev = deviceStatusMap.get(device.id)?.status ?? "unknown";

          const updated = {
            id: device.id,
            status: newStatus,
            ping: result.time,
            lastSeen: new Date(),
          };

          deviceStatusMap.set(device.id, updated);

          if (prev !== newStatus) {
            changedDevices.push({
              ...device,
              ...updated,
            });
          }
        })
      );
    }

    if (changedDevices.length > 0) {
      io.emit("monitoring:update", changedDevices);
      console.log("Device updated:", changedDevices.length);
    }
  } catch (err) {
    console.error("Monitoring error:", err.message);
  }
};

const getFinalDevices = () => {
  return devicesFromDB.map((device) => {
    const status = deviceStatusMap.get(device.id);

    return {
      ...device,
      status: status?.status ?? device.monitoringStatus ?? "offline",
      ping: status?.ping ?? null,
      lastSeen: status?.lastSeen ?? null,
    };
  });
};

const setupMonitoringSocket = () => {
  const io = getIO();
  if (!io) return;

  io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id);

    await refreshDevices();

    socket.emit("monitoring:init", getFinalDevices());
  });
};

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

setInterval(refreshDevices, REFRESH_INTERVAL);
setInterval(runMonitoring, MONITOR_INTERVAL);

(async () => {
  await refreshDevices();
  setupMonitoringSocket();
  setTimeout(runMonitoring, 2000);
})();

module.exports = {
  runMonitoring,
  getFinalDevices,
};
