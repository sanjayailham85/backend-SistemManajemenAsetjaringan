const CCTV = require("../models/cctv.model");
const activityLogHelper = require("../helpers/activityLog.helper");

const { v4: uuidv4 } = require("uuid");

const getAllCCTV = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await CCTV.getAll(limit, offset);
    const total = await CCTV.getCount();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting CCTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCCTVById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CCTV.getById(id);

    if (!data) return res.status(404).json({ message: "CCTV not found" });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting CCTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createCCTV = async (req, res) => {
  try {
    const { name, ip, type, location, locationDetail, status, detail, code } =
      req.body;

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
    };

    await CCTV.create(newData);
    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "cctv",
      action: "create",
      targetId: id,
      description: `Created CCTV ${name}`,
      newData,
    });

    res.status(201).json({ message: "CCTV created", id });
  } catch (error) {
    console.error("Error creating CCTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCCTV = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, ip, type, location, locationDetail, status, detail, code } =
      req.body;

    if (!id) return res.status(400).json({ message: "CCTV ID is required" });

    const oldData = await CCTV.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Access Point not found" });
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
    };

    const affectedRows = await CCTV.update(id, newData);

    if (affectedRows === 0)
      return res.status(404).json({ message: "CCTV not found" });

    await activityLogHelper({
      userId: req.user?.id,
      module: "cctv",
      action: "update",
      targetId: id,
      description: `Updated CCTV ${name || oldData.name}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "CCTV updated" });
  } catch (error) {
    console.error("Error updating CCTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCCTV = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "CCTV ID is required" });

    const oldData = await CCTV.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Access Point not found" });
    }

    const affectedRows = await CCTV.delete(id);

    if (affectedRows === 0)
      return res.status(404).json({ message: "CCTV not found" });

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "cctv",
      action: "delete",
      targetId: id,
      description: `Deleted CCTV ${oldData.name}`,
      oldData,
    });

    res.status(200).json({ message: "CCTV deleted" });
  } catch (error) {
    console.error("Error deleting CCTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCCTV,
  getCCTVById,
  createCCTV,
  updateCCTV,
  deleteCCTV,
};
