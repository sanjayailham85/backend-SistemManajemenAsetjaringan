const AccessPoint = require("../models/accessPoint.model");
const activityLogHelper = require("../helpers/activityLog.helper");
const { v4: uuidv4 } = require("uuid");

const getAllAccessPoint = async (req, res) => {
  try {
    let { page, limit, controllerId } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await AccessPoint.getAll(limit, offset, controllerId);
    const total = await AccessPoint.getCount(controllerId);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAccessPointById = async (req, res) => {
  try {
    const { id } = req.params;

    const accessPoint = await AccessPoint.getById(id);

    if (!accessPoint) {
      return res.status(404).json({ message: "Access Point not found" });
    }

    res.status(200).json(accessPoint);
  } catch (error) {
    console.error("Error getting access point:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createAccessPoint = async (req, res) => {
  try {
    const {
      name,
      ip,
      tahunAnggaran,
      mac,
      controllerAP,
      controllerId,
      type,
      location,
      locationDetail,
      code,
      merk,
    } = req.body;

    if (!name || !ip) {
      return res.status(400).json({ message: "Name and ip are required" });
    }

    const id = uuidv4();

    const newData = {
      id,
      name,
      ip,
      tahunAnggaran,
      mac,
      controllerAP,
      controllerId,
      type,
      location,
      locationDetail,
      code,
      merk,
    };

    await AccessPoint.create(newData);

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "accessPoint",
      action: "create",
      targetId: id,
      description: `Created Access Point ${name}`,
      newData,
    });

    res.status(201).json({ message: "Access Point created", id });
  } catch (error) {
    console.error("Error creating Access Point:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAccessPoint = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      ip,
      tahunAnggaran,
      mac,
      controllerAP,
      controllerId,
      type,
      location,
      locationDetail,
      code,
      merk,
    } = req.body;

    const oldData = await AccessPoint.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Access Point not found" });
    }

    const newData = {
      name,
      ip,
      tahunAnggaran,
      mac,
      controllerAP,
      controllerId,
      type,
      location,
      locationDetail,
      code,
      merk,
    };

    await AccessPoint.update(id, newData);

    await activityLogHelper({
      userId: req.user?.id,
      module: "accessPoint",
      action: "update",
      targetId: id,
      description: `Updated Access Point ${name || oldData.name}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "Access Point updated" });
  } catch (error) {
    console.error("Error updating Access Point:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAccessPoint = async (req, res) => {
  try {
    const { id } = req.params;

    const oldData = await AccessPoint.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Access Point not found" });
    }

    await AccessPoint.delete(id);

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "accessPoint",
      action: "delete",
      targetId: id,
      description: `Deleted Access Point ${oldData.name}`,
      oldData,
    });

    res.status(200).json({ message: "Access Point deleted" });
  } catch (error) {
    console.error("Error deleting Access Point:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllAccessPoint,
  getAccessPointById,
  createAccessPoint,
  updateAccessPoint,
  deleteAccessPoint,
};
