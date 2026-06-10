const db = require("../config/db");

const Merk = {
  getAll: async (limit, offset) => {
    const [rows] = await db.query(
      `
      SELECT 
        m.*,
        COUNT(c.id) AS totalcontroller
      FROM accesspointmerk m
      LEFT JOIN accesspointcontroller c ON c.merkId = m.id
      GROUP BY m.id
      ORDER BY m.name ASC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    return rows;
  },

  getCount: async () => {
    const [rows] = await db.query(
      `SELECT COUNT(*) as total FROM accesspointmerk`
    );

    return rows[0].total;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM accesspointmerk WHERE id = ?",
      [id]
    );
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
      `INSERT INTO accesspointmerk (${columns}) VALUES (${placeholders})`,
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
      `UPDATE accesspointmerk SET ${columns} WHERE id = ?`,
      values
    );

    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query(
      "DELETE FROM accesspointmerk WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  },
};

module.exports = Merk;
