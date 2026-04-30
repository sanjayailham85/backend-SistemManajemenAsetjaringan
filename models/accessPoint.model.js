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

const AccessPoint = {
  getAll: async (limit, offset, controllerId) => {
    const [rows] = await db.query(
      `
      SELECT * FROM accessPoint
      WHERE controllerId = ?
      ORDER BY name ASC
      LIMIT ? OFFSET ?
      `,
      [controllerId, limit, offset]
    );

    return rows;
  },

  getCount: async (controllerId) => {
    const [rows] = await db.query(
      `
      SELECT COUNT(*) as total
      FROM accessPoint
      WHERE controllerId = ?
      `,
      [controllerId]
    );

    return rows[0].total;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM accessPoint WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },
  getByControllerId: async (controllerId) => {
    const [rows] = await db.query(
      "SELECT id FROM accessPoint WHERE controllerId = ?",
      [controllerId]
    );
    return rows;
  },

  create: async (data) => {
    const now = getCurrentDateTime();

    const newData = {
      ...data,
      category: "network",
      createdAt: now,
      updatedAt: now,
    };

    const columns = Object.keys(newData).join(", ");
    const placeholders = Object.keys(newData)
      .map(() => "?")
      .join(", ");
    const values = Object.values(newData);

    const [result] = await db.query(
      `INSERT INTO accessPoint (${columns}) VALUES (${placeholders})`,
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
      `UPDATE accessPoint SET ${columns} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM accessPoint WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  },
};

module.exports = AccessPoint;
