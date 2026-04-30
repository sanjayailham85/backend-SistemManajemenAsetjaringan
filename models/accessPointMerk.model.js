const db = require("../config/db");

const Merk = {
  getAll: async (limit, offset) => {
    const [rows] = await db.query(
      `
      SELECT 
        m.*,
        COUNT(c.id) AS totalController
      FROM accessPointMerk m
      LEFT JOIN accessPointController c ON c.merkId = m.id
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
      `SELECT COUNT(*) as total FROM accessPointMerk`
    );

    return rows[0].total;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM accessPointMerk WHERE id = ?",
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
      `INSERT INTO accessPointMerk (${columns}) VALUES (${placeholders})`,
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
      `UPDATE accessPointMerk SET ${columns} WHERE id = ?`,
      values
    );

    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query(
      "DELETE FROM accessPointMerk WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  },
};

module.exports = Merk;
