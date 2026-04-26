const db = require("../config/db");

const ActivityLog = {
  getAll: async (limit, offset) => {
    const safeLimit = Math.max(1, parseInt(limit, 10) || 10);
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

    const [rows] = await db.query(
      `
      SELECT
        al.id,
        al.userId,
        u.name,
        al.module,
        al.action,
        al.targetId,
        al.description,
        al.oldData,
        al.newData,
        al.createdAt
      FROM activitylogs al
      LEFT JOIN users u ON u.id = al.userId
      ORDER BY al.createdAt DESC
      LIMIT ? OFFSET ?
      `,
      [safeLimit, safeOffset]
    );

    return rows.map((row) => ({
      ...row,
      oldData: row.oldData ? JSON.parse(row.oldData) : null,
      newData: row.newData ? JSON.parse(row.newData) : null,
    }));
  },

  getCount: async () => {
    const [rows] = await db.query(`SELECT COUNT(*) as total FROM activitylogs`);

    return rows[0].total;
  },

  getRecent: async (limit = 5) => {
    const safeLimit = Math.max(1, parseInt(limit, 10) || 5);

    const [rows] = await db.query(
      `
      SELECT
        al.id,
        al.userId,
        u.name,
        al.module,
        al.action,
        al.targetId,
        al.description,
        al.oldData,
        al.newData,
        al.createdAt
      FROM activitylogs al
      LEFT JOIN users u ON u.id = al.userId
      ORDER BY al.createdAt DESC
      LIMIT ?
      `,
      [safeLimit]
    );

    return rows.map((row) => ({
      ...row,
      oldData: row.oldData ? JSON.parse(row.oldData) : null,
      newData: row.newData ? JSON.parse(row.newData) : null,
    }));
  },

  create: async ({
    userId,
    module,
    action,
    targetId = null,
    description,
    oldData = null,
    newData = null,
  }) => {
    const [result] = await db.query(
      `
      INSERT INTO activitylogs
      (userId, module, action, targetId, description, oldData, newData, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        userId ?? null,
        module ?? null,
        action ?? null,
        targetId ?? null,
        description ?? null,
        oldData ? JSON.stringify(oldData) : null,
        newData ? JSON.stringify(newData) : null,
      ]
    );

    return result.insertId;
  },
  delete: async (id) => {
    const safeId = parseInt(id, 10);

    if (!safeId) {
      throw new Error("Invalid ID");
    }

    const [result] = await db.query(`DELETE FROM activitylogs WHERE id = ?`, [
      safeId,
    ]);

    return result.affectedRows;
  },
};

module.exports = ActivityLog;
