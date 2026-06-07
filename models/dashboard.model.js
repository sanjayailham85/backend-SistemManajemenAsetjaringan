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

    const [cctvByMerk] = await db.query(`
      SELECT cm.name AS merk, COUNT(c.id) AS total
      FROM cctvController c
      LEFT JOIN cctvMerk cm ON c.merkId = cm.id
      GROUP BY cm.id, cm.name
      `);

    const [accessPointByMerk] = await db.query(`
      SELECT apm.name AS merk, COUNT(a.id) AS total
      FROM accessPointController a
      LEFT JOIN accessPointMerk apm ON a.merkId = apm.id
      GROUP BY apm.id, apm.name
      `);

    const [switchByMerk] = await db.query(`
      SELECT sm.name AS merk, COUNT(s.id) AS total
      FROM switchController s
      LEFT JOIN switchMerk sm ON s.merkId = sm.id
      GROUP BY sm.id, sm.name
      `);

    return {
      racks: rack.total,
      physical: physical.total,
      host: host.total,
      guest: guest.total,

      devices: [
        { name: "Router", value: router.total },
        { name: "Switch", value: switchDevice.total },
        { name: "Access Point", value: accessPoint.total },
        { name: "CCTV", value: cctv.total },
      ],

      totalDevices:
        physical.total +
        host.total +
        guest.total +
        router.total +
        switchDevice.total +
        accessPoint.total +
        cctv.total,

      deviceStatus: [
        { name: "Active", value: statusCount.Active },
        { name: "Inactive", value: statusCount.Inactive },
        { name: "Damaged", value: statusCount.Damaged },
      ],

      deviceStatusPerDevice,

      cctvByMerk,
      accessPointByMerk,
      switchByMerk,
    };
  },
};

module.exports = Dashboard;
