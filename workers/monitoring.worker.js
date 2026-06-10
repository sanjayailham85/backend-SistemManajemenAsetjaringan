const {
  getAllDevicesMonitoringService,
} = require("../services/deviceMonitoring.service");
const { pingDevice } = require("../utils/pingDevices");
const { getIO } = require("../utils/sockets");

let cachedDevices = [];
let previousStatuses = {};

const REFRESH_INTERVAL = 60000;
const MONITOR_INTERVAL = 10000;
const CONCURRENT_LIMIT = 10;

const refreshDevices = async () => {
  try {
    const devices = await getAllDevicesMonitoringService();

    const newStatusMap = {};

    cachedDevices = devices.map((device) => {
      const prev =
        previousStatuses[device.id] || device.monitoringStatus || "offline";

      newStatusMap[device.id] = prev;

      return {
        ...device,
        monitoringStatus: prev,
      };
    });

    previousStatuses = newStatusMap;

    console.log("Devices refreshed:", cachedDevices.length);
  } catch (err) {
    console.error("Refresh devices error:", err.message);
  }
};

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const runMonitoring = async () => {
  try {
    const io = getIO();

    if (!io) {
      console.log("IO not ready");
      return;
    }

    console.log("RUN MONITORING TICK");

    if (!cachedDevices.length) return;

    const batches = chunkArray(cachedDevices, CONCURRENT_LIMIT);

    const changedDevices = [];
    const updatedDevices = [];

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (device) => {
          const result = await pingDevice(device.ip);

          // console.log("PING:", device.ip, result);

          let newStatus = "offline";

          if (result.alive) {
            newStatus = result.time && result.time > 30 ? "warning" : "online";
          }

          const oldStatus = previousStatuses[device.id];

          const updatedDevice = {
            ...device,
            status: newStatus,
            monitoringStatus: newStatus,
            ping: result.time,
            lastSeen: new Date(),
          };

          changedDevices.push(updatedDevice);

          previousStatuses[device.id] = newStatus;
          updatedDevices.push(updatedDevice);
        })
      );
    }

    cachedDevices = updatedDevices;

    if (changedDevices.length > 0) {
      console.log("Device updated:", changedDevices.length);
      io.emit("monitoring:update", changedDevices);
    }
  } catch (err) {
    console.error("Monitoring error:", err.message);
  }
};

const setupMonitoringSocket = () => {
  const io = getIO();

  if (!io) {
    console.log("Socket not initialized");
    return;
  }

  io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id);

    await refreshDevices();

    socket.emit("monitoring:init", cachedDevices);
  });
};

setInterval(() => {
  refreshDevices().catch((err) =>
    console.error("refreshDevices error:", err.message)
  );
}, REFRESH_INTERVAL);

setInterval(() => {
  runMonitoring().catch((err) =>
    console.error("runMonitoring error:", err.message)
  );
}, MONITOR_INTERVAL);

(async () => {
  await refreshDevices();

  setupMonitoringSocket();

  setTimeout(() => {
    runMonitoring();
  }, 2000);
})();

module.exports = runMonitoring;
