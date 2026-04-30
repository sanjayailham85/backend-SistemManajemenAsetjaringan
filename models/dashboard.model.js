// // const db = require("../config/db");

// // const Dashboard = {
// //   getSummary: async () => {
// //     const [[rack]] = await db.query("SELECT COUNT(*) as total FROM rack");
// //     const [[physical]] = await db.query(
// //       "SELECT COUNT(*) as total FROM physicalServer"
// //     );
// //     const [[host]] = await db.query("SELECT COUNT(*) as total FROM host");
// //     const [[guest]] = await db.query("SELECT COUNT(*) as total FROM guest");

// //     const [[router]] = await db.query("SELECT COUNT(*) as total FROM router");
// //     const [[switchDevice]] = await db.query(
// //       "SELECT COUNT(*) as total FROM switch"
// //     );
// //     const [[accessPoint]] = await db.query(
// //       "SELECT COUNT(*) as total FROM accessPoint"
// //     );
// //     const [[cctv]] = await db.query("SELECT COUNT(*) as total FROM cctv");

// //     const tables = [
// //       "physicalServer",
// //       "host",
// //       "guest",
// //       "router",
// //       "switch",
// //       "cctv",
// //     ];

// //     const statusCount = {
// //       Active: 0,
// //       Inactive: 0,
// //       Damaged: 0,
// //     };

// //     for (const table of tables) {
// //       const [rows] = await db.query(`
// //         SELECT status, COUNT(*) as total
// //         FROM ${table}
// //         GROUP BY status
// //       `);

// //       rows.forEach((row) => {
// //         if (statusCount[row.status] !== undefined) {
// //           statusCount[row.status] += row.total;
// //         }
// //       });
// //     }

// //     return {
// //       racks: rack.total,
// //       physical: physical.total,
// //       host: host.total,
// //       guest: guest.total,

// //       networkDevices: [
// //         { name: "Router", value: router.total },
// //         { name: "Switch", value: switchDevice.total },
// //         { name: "Access Point", value: accessPoint.total },
// //       ],

// //       securityDevices: [{ name: "CCTV", value: cctv.total }],

// //       totalDevices:
// //         router.total + switchDevice.total + accessPoint.total + cctv.total,

// //       deviceStatus: [
// //         { name: "Active", value: statusCount.Active },
// //         { name: "Inactive", value: statusCount.Inactive },
// //         { name: "Damaged", value: statusCount.Damaged },
// //       ],
// //     };
// //   },
// // };

// // module.exports = Dashboard;

// const db = require("../config/db");

// const Dashboard = {
//   getSummary: async () => {
//     const [[rack]] = await db.query("SELECT COUNT(*) as total FROM rack");
//     const [[physical]] = await db.query(
//       "SELECT COUNT(*) as total FROM physicalServer"
//     );
//     const [[host]] = await db.query("SELECT COUNT(*) as total FROM host");
//     const [[guest]] = await db.query("SELECT COUNT(*) as total FROM guest");

//     const [[router]] = await db.query("SELECT COUNT(*) as total FROM router");
//     const [[switchDevice]] = await db.query(
//       "SELECT COUNT(*) as total FROM switch"
//     );
//     const [[accessPoint]] = await db.query(
//       "SELECT COUNT(*) as total FROM accessPoint"
//     );
//     const [[cctv]] = await db.query("SELECT COUNT(*) as total FROM cctv");

//     // =========================
//     // STATUS TOTAL (TETAP ADA)
//     // =========================
//     const tables = [
//       "physicalServer",
//       "host",
//       "guest",
//       "router",
//       "switch",
//       "cctv",
//     ];

//     const statusCount = {
//       Active: 0,
//       Inactive: 0,
//       Damaged: 0,
//     };

//     // =========================
//     // STATUS PER DEVICE (BARU)
//     // =========================
//     const deviceStatusPerDevice = {};

//     for (const table of tables) {
//       const [rows] = await db.query(`
//         SELECT status, COUNT(*) as total
//         FROM ${table}
//         GROUP BY status
//       `);

//       deviceStatusPerDevice[table] = {
//         Active: 0,
//         Inactive: 0,
//         Damaged: 0,
//       };

//       rows.forEach((row) => {
//         if (statusCount[row.status] !== undefined) {
//           statusCount[row.status] += row.total;
//         }

//         if (deviceStatusPerDevice[table][row.status] !== undefined) {
//           deviceStatusPerDevice[table][row.status] = row.total;
//         }
//       });
//     }

//     // =========================
//     // CCTV BY MERK
//     // =========================
//     const [cctvByMerk] = await db.query(`
//       SELECT cm.name as merk, COUNT(c.id) as total
//       FROM cctv c
//       LEFT JOIN cctvMerk cm ON c.merk = cm.id
//       GROUP BY c.merk
//     `);

//     // =========================
//     // ACCESS POINT BY MERK
//     // =========================
//     const [accessPointByMerk] = await db.query(`
//       SELECT apm.name as merk, COUNT(a.id) as total
//       FROM accessPoint a
//       LEFT JOIN accessPointMerk apm ON a.merk = apm.id
//       GROUP BY a.merk
//     `);

//     return {
//       racks: rack.total,
//       physical: physical.total,
//       host: host.total,
//       guest: guest.total,

//       networkDevices: [
//         { name: "Router", value: router.total },
//         { name: "Switch", value: switchDevice.total },
//         { name: "Access Point", value: accessPoint.total },
//       ],

//       securityDevices: [{ name: "CCTV", value: cctv.total }],

//       totalDevices:
//         router.total + switchDevice.total + accessPoint.total + cctv.total,

//       // tetap ada (TOTAL GLOBAL)
//       deviceStatus: [
//         { name: "Active", value: statusCount.Active },
//         { name: "Inactive", value: statusCount.Inactive },
//         { name: "Damaged", value: statusCount.Damaged },
//       ],

//       // tambahan baru (PER DEVICE)
//       deviceStatusPerDevice,

//       cctvByMerk,
//       accessPointByMerk,
//     };
//   },
// };

// module.exports = Dashboard;

const db = require("../config/db");

const Dashboard = {
  getSummary: async () => {
    const [[rack]] = await db.query("SELECT COUNT(*) as total FROM rack");
    const [[physical]] = await db.query(
      "SELECT COUNT(*) as total FROM physicalServer"
    );
    const [[host]] = await db.query("SELECT COUNT(*) as total FROM host");
    const [[guest]] = await db.query("SELECT COUNT(*) as total FROM guest");

    const [[router]] = await db.query("SELECT COUNT(*) as total FROM router");
    const [[switchDevice]] = await db.query(
      "SELECT COUNT(*) as total FROM switch"
    );
    const [[accessPoint]] = await db.query(
      "SELECT COUNT(*) as total FROM accessPoint"
    );
    const [[cctv]] = await db.query("SELECT COUNT(*) as total FROM cctv");

    // =========================
    // STATUS TOTAL
    // =========================
    const tables = [
      "physicalServer",
      "host",
      "guest",
      "router",
      "switch",
      "cctv",
    ];

    const statusCount = {
      Active: 0,
      Inactive: 0,
      Damaged: 0,
    };

    // =========================
    // STATUS PER DEVICE
    // =========================
    const deviceStatusPerDevice = {};

    for (const table of tables) {
      const [rows] = await db.query(`
        SELECT status, COUNT(*) as total
        FROM ${table}
        GROUP BY status
      `);

      deviceStatusPerDevice[table] = {
        Active: 0,
        Inactive: 0,
        Damaged: 0,
      };

      rows.forEach((row) => {
        if (statusCount[row.status] !== undefined) {
          statusCount[row.status] += row.total;
        }

        if (deviceStatusPerDevice[table][row.status] !== undefined) {
          deviceStatusPerDevice[table][row.status] = row.total;
        }
      });
    }

    // =========================
    // MERK CCTV
    // =========================
    // CCTV BY MERK
    const [cctvByMerk] = await db.query(`
SELECT cm.name AS merk, COUNT(c.id) AS total
FROM cctvController c
LEFT JOIN cctvMerk cm ON c.merkId = cm.id
GROUP BY cm.id, cm.name
`);

    // ACCESS POINT BY MERK
    const [accessPointByMerk] = await db.query(`
SELECT apm.name AS merk, COUNT(a.id) AS total
FROM accessPointController a
LEFT JOIN accessPointMerk apm ON a.merkId = apm.id
GROUP BY apm.id, apm.name
`);

    return {
      racks: rack.total,
      physical: physical.total,
      host: host.total,
      guest: guest.total,

      // =========================
      // DEVICE DIGABUNG (BARU)
      // =========================
      devices: [
        { name: "Router", value: router.total },
        { name: "Switch", value: switchDevice.total },
        { name: "Access Point", value: accessPoint.total },
        { name: "CCTV", value: cctv.total },
      ],

      totalDevices:
        router.total + switchDevice.total + accessPoint.total + cctv.total,

      // STATUS GLOBAL
      deviceStatus: [
        { name: "Active", value: statusCount.Active },
        { name: "Inactive", value: statusCount.Inactive },
        { name: "Damaged", value: statusCount.Damaged },
      ],

      // STATUS PER DEVICE
      deviceStatusPerDevice,

      // MERK
      cctvByMerk,
      accessPointByMerk,
    };
  },
};

module.exports = Dashboard;
