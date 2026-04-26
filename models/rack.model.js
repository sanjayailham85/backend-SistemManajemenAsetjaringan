const db = require("../config/db");

const Rack = {
  getAll: async (limit, offset) => {
    const safeLimit = Math.max(1, parseInt(limit, 10) || 10);
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);
    const [rows] = await db.query(
      `
  SELECT * FROM rack
  ORDER BY name ASC
  LIMIT ? OFFSET ?
  `,
      [safeLimit, safeOffset]
    );
    return rows;
  },

  getCount: async () => {
    const [rows] = await db.query(`SELECT COUNT(*) as total FROM rack`);

    return rows[0].total;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM rack WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { id, name, location } = data;
    const [result] = await db.query(
      "INSERT INTO rack (id, name, location) VALUES (?, ?, ?)",
      [id, name, location]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { name, location } = data;
    const [result] = await db.query(
      "UPDATE rack SET name = ?, location = ? WHERE id = ?",
      [name, location, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM rack WHERE id = ?", [id]);
    return result.affectedRows;
  },
};

module.exports = Rack;
