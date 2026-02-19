const db = require("../config/db");

const Rack = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM rack ORDER BY name ASC");
    return rows;
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
