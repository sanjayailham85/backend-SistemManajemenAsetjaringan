const db = require("../config/db");

const SwitchController = {
  getAll: async (limit, offset, merkId) => {
    const [rows] = await db.query(
      `
      SELECT
        c.*,
        COUNT(a.id) AS totalswitch
      FROM switchcontroller c
      LEFT JOIN switch a ON a.controllerId = c.id
      WHERE c.merkId = ?
      GROUP BY c.id
      ORDER BY c.ip ASC
      LIMIT ? OFFSET ?
      `,
      [merkId, limit, offset]
    );

    return rows;
  },

  getAllForMonitoring: async () => {
    const [rows] = await db.query(`
      SELECT * FROM switchcontroller
      ORDER BY ip ASC
    `);

    return rows;
  },

  getCount: async (merkId) => {
    const [rows] = await db.query(
      `
      SELECT COUNT(*) as total
      FROM switchcontroller
      WHERE merkId = ?
      `,
      [merkId]
    );

    return rows[0].total;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM switchcontroller WHERE id = ?",
      [id]
    );
    return rows[0];
  },
  getByMerkId: async (merkId) => {
    const [rows] = await db.query(
      "SELECT id FROM switchcontroller WHERE merkId = ?",
      [merkId]
    );
    return rows;
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
      `INSERT INTO switchcontroller (${columns}) VALUES (${placeholders})`,
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
      `UPDATE switchcontroller SET ${columns} WHERE id = ?`,
      values
    );

    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query(
      "DELETE FROM switchcontroller WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  },
};

module.exports = SwitchController;
