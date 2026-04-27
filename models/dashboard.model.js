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

    for (const table of tables) {
      const [rows] = await db.query(`
        SELECT status, COUNT(*) as total
        FROM ${table}
        GROUP BY status
      `);

      rows.forEach((row) => {
        if (statusCount[row.status] !== undefined) {
          statusCount[row.status] += row.total;
        }
      });
    }

    return {
      racks: rack.total,
      physical: physical.total,
      host: host.total,
      guest: guest.total,

      networkDevices: [
        { name: "Router", value: router.total },
        { name: "Switch", value: switchDevice.total },
        { name: "Access Point", value: accessPoint.total },
      ],

      securityDevices: [{ name: "CCTV", value: cctv.total }],

      totalDevices:
        router.total + switchDevice.total + accessPoint.total + cctv.total,

      deviceStatus: [
        { name: "Active", value: statusCount.Active },
        { name: "Inactive", value: statusCount.Inactive },
        { name: "Damaged", value: statusCount.Damaged },
      ],
    };
  },
};

module.exports = Dashboard;
