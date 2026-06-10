const db = require("../config/db");

const getCurrentDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const Physical = {
  getAll: async (limit, offset) => {
    const safeLimit = Math.max(1, parseInt(limit, 10) || 10);
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);
    const [rows] = await db.query(
      `
  SELECT * FROM physicalserver
  ORDER BY name ASC
  LIMIT ? OFFSET ?
  `,
      [safeLimit, safeOffset]
    );
    return rows;
  },

  getCount: async () => {
    const [rows] = await db.query(
      `SELECT COUNT(*) as total FROM physicalserver`
    );

    return rows[0].total;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM physicalserver WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  getByRackId: async (rackId) => {
    const [rows] = await db.query(
      "SELECT id FROM physicalserver WHERE rackId = ?",
      [rackId]
    );
    return rows;
  },

  create: async (data) => {
    const now = getCurrentDateTime();

    const newData = {
      ...data,
      category: "server",
      createdAt: now,
      updatedAt: now,
    };

    const columns = Object.keys(newData).join(", ");
    const placeholders = Object.keys(newData)
      .map(() => "?")
      .join(", ");
    const values = Object.values(newData);

    const [result] = await db.query(
      `INSERT INTO physicalServer (${columns}) VALUES (${placeholders})`,
      values
    );
    return result;
  },

  update: async (id, data) => {
    const now = getCurrentDateTime();

    const updatedData = {
      ...data,
      updatedAt: now,
    };

    const columns = Object.keys(updatedData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updatedData), id];

    const [result] = await db.query(
      `UPDATE physicalServer SET ${columns} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM physicalserver WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  },
};

module.exports = Physical;
