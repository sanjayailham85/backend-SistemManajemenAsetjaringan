import db from "../config/db.js";

class ActivityLog {
  static async create({
    userId,
    category,
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
        category,
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
        userId,
        module,
        action,
        targetId,
        description,
        oldData ? JSON.stringify(oldData) : null,
        newData ? JSON.stringify(newData) : null,
      ]
    );

    return result.insertId;
  }

  static async getRecent(limit = 10) {
    const [rows] = await db.execute(
      `
      SELECT
        al.id,
        al.userId,
        u.name,
        al.category,
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
      [limit]
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
        al.category,
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

export default ActivityLog;
