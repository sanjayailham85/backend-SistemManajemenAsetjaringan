const Router = require("../models/router.model");
const activityLogHelper = require("../helpers/activityLog.helper");
const { v4: uuidv4 } = require("uuid");

const getAllRouter = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await Router.getAll(limit, offset);
    const total = await Router.getCount();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting Router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRouterById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Router.getById(id);

    if (!data) return res.status(404).json({ message: "Router not found" });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting Router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createRouter = async (req, res) => {
  try {
    const {
      name,
      ip,
      type,
      location,
      locationDetail,
      status,
      detail,
      code,
      merk,
    } = req.body;

    if (!name || !ip)
      return res.status(400).json({ message: "Name and IP are required" });

    const id = uuidv4();

    const newData = {
      id,
      name,
      ip,
      type,
      location,
      locationDetail,
      status,
      detail,
      code,
      merk,
    };
    await Router.create(newData);
    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "router",
      action: "create",
      targetId: id,
      description: `Created Router ${name}`,
      newData,
    });
    res.status(201).json({ message: "Router created", id });
  } catch (error) {
    console.error("Error creating Router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRouter = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      ip,

      type,
      location,
      locationDetail,
      status,
      detail,
      code,
      merk,
    } = req.body;

    if (!id) return res.status(400).json({ message: "Router ID is required" });
    const oldData = await Router.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Router not found" });
    }

    const newData = {
      name,
      ip,
      type,
      location,
      locationDetail,
      status,
      detail,
      code,
      merk,
    };
    const affectedRows = await Router.update(id, newData);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Router not found" });

    await activityLogHelper({
      userId: req.user?.id,
      module: "router",
      action: "update",
      targetId: id,
      description: `Updated Router ${name || oldData.name}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "Router updated" });
  } catch (error) {
    console.error("Error updating Router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRouter = async (req, res) => {
  try {
    const { id } = req.params;

    const oldData = await Router.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const affectedRows = await Router.delete(id);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Router not found" });
    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "router",
      action: "delete",
      targetId: id,
      description: `Deleted Router ${oldData.name}`,
      oldData,
    });

    res.status(200).json({ message: "Router deleted" });
  } catch (error) {
    console.error("Error deleting Router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllRouter,
  getRouterById,
  createRouter,
  updateRouter,
  deleteRouter,
};
