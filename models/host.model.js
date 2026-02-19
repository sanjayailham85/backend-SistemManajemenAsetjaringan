const db = require("../config/db");

const Host = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM host");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM host WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const values = Object.values(data);

    const [result] = await db.query(
      `INSERT INTO host (${columns}) VALUES (${placeholders})`,
      values
    );
    return result;
  },

  update: async (id, data) => {
    const columns = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(data), id];

    const [result] = await db.query(
      `UPDATE host SET ${columns} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM host WHERE id = ?", [id]);
    return result.affectedRows;
  },
};

module.exports = Host;
