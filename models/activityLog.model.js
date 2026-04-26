const db = require("../config/db");

class ActivityLog {
  static async create({
    userId,
    module,
    action,
    targetId = null,
    description,
    oldData = null,
    newData = null,
  }) {
    const [result] = await db.execute(
      `
      INSERT INTO activitylogs
      (
        userId,
        module,
        action,
        targetId,
        description,
        oldData,
        newData,
        createdAt
      )
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
  }

  static async getRecent(limit = 5) {
    const safeLimit = Number(limit) || 5;

    const [rows] = await db.execute(
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
      LIMIT ${safeLimit}
      `
    );

    return rows.map((row) => ({
      ...row,
      oldData: row.oldData ? JSON.parse(row.oldData) : null,
      newData: row.newData ? JSON.parse(row.newData) : null,
    }));
  }

  static async getAll() {
    const [rows] = await db.execute(
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
      `
    );

    return rows.map((row) => ({
      ...row,
      oldData: row.oldData ? JSON.parse(row.oldData) : null,
      newData: row.newData ? JSON.parse(row.newData) : null,
    }));
  }
}

module.exports = ActivityLog;
