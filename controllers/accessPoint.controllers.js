const AccessPoint = require("../models/accessPoint.model");
const activityLogHelper = require("../helpers/activityLog.helper");
const { v4: uuidv4 } = require("uuid");

const getAllAccessPoint = async (req, res) => {
  try {
    const accessPoint = await AccessPoint.getAll();
    res.status(200).json(accessPoint);
  } catch (error) {
    console.error("Error getting access point:", error);
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
      type,
      location,
      locationDetail,
      code,
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
      type,
      location,
      locationDetail,
      code,
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
      type,
      location,
      locationDetail,
      code,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Access Point ID is required" });
    }

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
      type,
      location,
      locationDetail,
      code,
    };

    const affectedRows = await AccessPoint.update(id, newData);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Access Point not found" });
    }
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

    if (!id) {
      return res.status(400).json({ message: "Access Point ID is required" });
    }

    const oldData = await AccessPoint.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Access Point not found" });
    }

    const affectedRows = await AccessPoint.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Access Point not found" });
    }

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
