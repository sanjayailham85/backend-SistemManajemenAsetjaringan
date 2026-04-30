const db = require("../config/db");

const Merk = {
  getAll: async (limit, offset) => {
    const safeLimit = Math.max(1, parseInt(limit, 10) || 10);
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);
    const [rows] = await db.query(
      `
  SELECT * FROM merk
  ORDER BY name ASC
  LIMIT ? OFFSET ?
  `,
      [safeLimit, safeOffset]
    );
    return rows;
  },

  getCount: async () => {
    const [rows] = await db.query(`SELECT COUNT(*) as total FROM merk`);

    return rows[0].total;
  },

  getMerkById: async (id) => {
    const [rows] = await db.query("SELECT * FROM merk WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const newData = {
      ...data,
    };

    const columns = Object.keys(newData).join(", ");
    const placeholders = Object.keys(newData)
      .map(() => "?")
      .join(", ");
    const values = Object.values(newData);

    const [result] = await db.query(
      `INSERT INTO merk (${columns}) VALUES (${placeholders})`,
      values
    );

    return result;
  },

  update: async (id, data) => {
    const updatedData = {
      ...data,
    };

    const columns = Object.keys(updatedData)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = [...Object.values(updatedData), id];

    const [result] = await db.query(
      `UPDATE merk SET ${columns} WHERE id = ?`,
      values
    );

    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM merk WHERE id = ?", [id]);
    return result.affectedRows;
  },
};

module.exports = Merk;
