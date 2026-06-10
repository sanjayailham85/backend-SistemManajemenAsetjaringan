// const {
//   getAllDevicesMonitoringService,
// } = require("../services/deviceMonitoring.service");
// const { pingDevice } = require("../utils/pingDevices");
// const { getIO } = require("../utils/sockets");

// let cachedDevices = [];
// let previousStatuses = {};

// const REFRESH_INTERVAL = 60000; // refresh DB 1 menit
// const MONITOR_INTERVAL = 10000; // cek status 10 detik
// const CONCURRENT_LIMIT = 10; // maksimal 10 ping bersamaan

// // refresh daftar device dari database
// const refreshDevices = async () => {
//   try {
//     const devices = await getAllDevicesMonitoringService();

//     cachedDevices = devices.map((device) => ({
//       ...device,
//       monitoringStatus:
//         previousStatuses[device.id] || device.monitoringStatus || "offline",
//     }));

//     console.log("Devices refreshed:", cachedDevices.length);
//   } catch (err) {
//     console.error("Refresh devices error:", err.message);
//   }
// };

// // helper membagi array per batch
// const chunkArray = (array, size) => {
//   const chunks = [];

//   for (let i = 0; i < array.length; i += size) {
//     chunks.push(array.slice(i, i + size));
//   }

//   return chunks;
// };

// // monitoring utama
// const runMonitoring = async () => {
//   try {
//     const io = getIO();

//     if (!cachedDevices.length) return;

//     const batches = chunkArray(cachedDevices, CONCURRENT_LIMIT);
//     const changedDevices = [];
//     const updatedDevices = [];

//     for (const batch of batches) {
//       const batchResults = await Promise.all(
//         batch.map(async (device) => {
//           const result = await pingDevice(device.ip);
//           let newStatus = "offline";

//           if (result.alive) {
//             if (result.time && result.time > 30) {
//               newStatus = "warning";
//             } else {
//               newStatus = "online";
//             }
//           }

//           const updatedDevice = {
//             ...device,
//             status: newStatus,
//             monitoringStatus: newStatus,
//             ping: result.time,
//             lastSeen: new Date(),
//           };

//           const oldStatus = previousStatuses[device.id];

//           if (oldStatus !== newStatus) {
//             changedDevices.push(updatedDevice);
//           }

//           previousStatuses[device.id] = newStatus;
//           updatedDevices.push(updatedDevice);

//           return updatedDevice;
//         })
//       );
//     }

//     // update cache seluruh device
//     cachedDevices = updatedDevices;

//     // kirim hanya yang berubah
//     if (changedDevices.length > 0) {
//       console.log("Device updated:", changedDevices.length);
//       io.emit("monitoring:update", changedDevices);
//     }
//   } catch (err) {
//     console.error("Monitoring error:", err.message);
//   }
// };

// // kirim data awal saat client connect
// const setupMonitoringSocket = () => {
//   const io = getIO();
//   console.log("INIT SIZE:", cachedDevices.length);
//   io.on("connection", (socket) => {
//     socket.emit("monitoring:init", cachedDevices || []);
//   });
// };

// // interval
// setInterval(refreshDevices, REFRESH_INTERVAL);
// setInterval(runMonitoring, MONITOR_INTERVAL);

// // pertama kali
// const startMonitoringSystem = async () => {
//   await refreshDevices();

//   setupMonitoringSocket();

//   setInterval(refreshDevices, 60000);
//   setInterval(runMonitoring, 10000);
// };

// startMonitoringSystem();

// module.exports = runMonitoring;

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

    cachedDevices = devices.map((device) => ({
      ...device,
      monitoringStatus:
        previousStatuses[device.id] || device.monitoringStatus || "offline",
    }));

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

    if (!cachedDevices.length) {
      console.log("No devices to monitor");
      return;
    }

    const batches = chunkArray(cachedDevices, CONCURRENT_LIMIT);

    const changedDevices = [];
    const updatedDevices = [];

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (device) => {
          const result = await pingDevice(device.ip);

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

          if (oldStatus !== newStatus) {
            changedDevices.push(updatedDevice);
          }

          previousStatuses[device.id] = newStatus;
          updatedDevices.push(updatedDevice);
        })
      );
    }

    cachedDevices = updatedDevices;

    console.log("Monitoring tick done");

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

  io.on("connection", (socket) => {
    console.log("Client connected");

    console.log("Init size:", cachedDevices.length);

    socket.emit("monitoring:init", cachedDevices || []);
  });
};

const startMonitoringSystem = async () => {
  console.log("Starting monitoring system");

  await refreshDevices();
  setupMonitoringSocket();

  setInterval(refreshDevices, REFRESH_INTERVAL);
  setInterval(runMonitoring, MONITOR_INTERVAL);
};

startMonitoringSystem();

module.exports = runMonitoring;
