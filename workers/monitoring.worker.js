const {
  getAllDevicesMonitoringService,
} = require("../services/deviceMonitoring.service");
const pingDevice = require("../utils/pingDevices");
const { getIO } = require("../utils/sockets");

let cachedDevices = [];
let previousStatuses = {};

const REFRESH_INTERVAL = 60000; // refresh DB 1 menit
const MONITOR_INTERVAL = 10000; // cek status 10 detik
const CONCURRENT_LIMIT = 10; // maksimal 10 ping bersamaan

// refresh daftar device dari database
const refreshDevices = async () => {
  try {
    cachedDevices = await getAllDevicesMonitoringService();
    console.log("Devices refreshed:", cachedDevices.length);
  } catch (err) {
    // console.error("Refresh devices error:", err.message);
  }
};

// helper membagi array per batch
const chunkArray = (array, size) => {
  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
};

// monitoring utama
const runMonitoring = async () => {
  try {
    const io = getIO();

    if (!cachedDevices.length) return;

    const batches = chunkArray(cachedDevices, CONCURRENT_LIMIT);
    const changedDevices = [];

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(async (device) => {
          const ping = await pingDevice(device.ip);
          const newStatus = ping.alive ? "online" : "offline";

          const updatedDevice = {
            id: device.id,
            name: device.name,
            ip: device.ip,
            category: device.category,
            status: device.status,
            monitoringStatus: newStatus,
            ping: ping.time,
            lastSeen: new Date(),
          };

          const oldStatus = previousStatuses[device.id];

          if (oldStatus !== newStatus) {
            changedDevices.push(updatedDevice);
          }

          previousStatuses[device.id] = newStatus;

          return updatedDevice;
        })
      );
    }

    // kirim hanya jika ada perubahan
    if (changedDevices.length > 0) {
      io.emit("monitoring:update", changedDevices);
    }
  } catch (err) {
    console.error("Monitoring error:", err.message);
  }
};

// interval
setInterval(refreshDevices, REFRESH_INTERVAL);
setInterval(runMonitoring, MONITOR_INTERVAL);

// pertama kali load
refreshDevices();

module.exports = runMonitoring;
