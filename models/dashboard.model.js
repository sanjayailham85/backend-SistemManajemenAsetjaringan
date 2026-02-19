const db = require("../config/db");

const Dashboard = {
  getStat: async () => {
    try {
      const [[rack]] = await db.query("SELECT COUNT(*) AS total FROM rack");
      const [[physical]] = await db.query(
        "SELECT COUNT(*) AS total FROM physicalServer"
      );
      const [[host]] = await db.query("SELECT COUNT(*) AS total FROM host");
      const [[guest]] = await db.query("SELECT COUNT(*) AS total FROM guest");

      return {
        rack: rack.total,
        physicalServer: physical.total,
        host: host.total,
        guest: guest.total,
      };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Dashboard;
