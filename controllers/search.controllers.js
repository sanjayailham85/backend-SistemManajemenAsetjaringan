const db = require("../config/db");

const searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    // const keyword = `${q}%`;
    const keyword = `%${q}%`;
    const params2 = [keyword, keyword];
    const params3 = [keyword, keyword, keyword];

    const [physical] = await db.query(
      "SELECT id, name, ip FROM physicalServer WHERE name LIKE ? OR ip LIKE ?",
      params2
    );

    const [host] = await db.query(
      "SELECT id, name, ip FROM host WHERE name LIKE ? OR ip LIKE ?",
      params2
    );

    const [guest] = await db.query(
      "SELECT id, name, ip FROM guest WHERE name LIKE ? OR ip LIKE ?",
      params2
    );

    const [switchData] = await db.query(
      "SELECT id, name, ip, location FROM switch WHERE name LIKE ? OR ip LIKE ? OR location LIKE ?",
      params3
    );

    const [router] = await db.query(
      "SELECT id, name, ip, location FROM router WHERE name LIKE ? OR ip LIKE ? OR location LIKE ?",
      params3
    );

    const [cctv] = await db.query(
      "SELECT id, name, ip, location FROM cctv WHERE name LIKE ? OR ip LIKE ? OR location LIKE ?",
      params3
    );

    const [accessPoint] = await db.query(
      "SELECT id, name, ip, location FROM accessPoint WHERE name LIKE ? OR ip LIKE ? OR location LIKE ?",
      params3
    );

    const result = [
      ...physical.map((i) => ({
        id: i.id,
        name: i.name,
        ip: i.ip,
        type: "physical",
      })),
      ...host.map((i) => ({ id: i.id, name: i.name, ip: i.ip, type: "host" })),
      ...guest.map((i) => ({
        id: i.id,
        name: i.name,
        ip: i.ip,
        type: "guest",
      })),
      ...switchData.map((i) => ({
        id: i.id,
        name: i.name,
        ip: i.ip,
        location: i.location,
        type: "switch",
      })),
      ...router.map((i) => ({
        id: i.id,
        name: i.name,
        ip: i.ip,
        location: i.location,
        type: "router",
      })),
      ...cctv.map((i) => ({
        id: i.id,
        name: i.name,
        ip: i.ip,
        location: i.location,
        type: "cctv",
      })),
      ...accessPoint.map((i) => ({
        id: i.id,
        name: i.name,
        type: "accessPoint",
        ip: i.ip,
        location: i.location,
      })),
    ];

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json([]);
  }
};

module.exports = { searchAll };
