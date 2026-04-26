const db = require("../config/db");

const searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const keyword = `${q}%`;

    const [physical] = await db.query(
      "SELECT id, name FROM physicalServer WHERE name LIKE ?",
      [keyword]
    );

    const [host] = await db.query(
      "SELECT id, name FROM host WHERE name LIKE ?",
      [keyword]
    );

    const [guest] = await db.query(
      "SELECT id, name FROM guest WHERE name LIKE ?",
      [keyword]
    );

    const [switchData] = await db.query(
      "SELECT id, name FROM switch WHERE name LIKE ?",
      [keyword]
    );

    const [router] = await db.query(
      "SELECT id, name FROM router WHERE name LIKE ?",
      [keyword]
    );

    const [cctv] = await db.query(
      "SELECT id, name FROM cctv WHERE name LIKE ?",
      [keyword]
    );

    const [accessPoint] = await db.query(
      "SELECT id, name FROM accessPoint WHERE name LIKE ?",
      [keyword]
    );

    const result = [
      ...physical.map((i) => ({ id: i.id, name: i.name, type: "physical" })),
      ...host.map((i) => ({ id: i.id, name: i.name, type: "host" })),
      ...guest.map((i) => ({ id: i.id, name: i.name, type: "guest" })),
      ...switchData.map((i) => ({ id: i.id, name: i.name, type: "switch" })),
      ...router.map((i) => ({ id: i.id, name: i.name, type: "router" })),
      ...cctv.map((i) => ({ id: i.id, name: i.name, type: "cctv" })),
      ...accessPoint.map((i) => ({
        id: i.id,
        name: i.name,
        type: "accessPoint",
      })),
    ];

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json([]);
  }
};

module.exports = { searchAll };
