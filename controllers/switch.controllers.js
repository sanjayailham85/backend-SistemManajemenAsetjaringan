const Switch = require("../models/switch.model");
const activityLogHelper = require("../helpers/activityLog.helper");
const { v4: uuidv4 } = require("uuid");
const { deleteImage } = require("../helpers/file.helper");

const getAllSwitch = async (req, res) => {
  try {
    let { page, limit, controllerId } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await Switch.getAll(limit, offset, controllerId);
    const total = await Switch.getCount(controllerId);

    const totalPages = Math.ceil(total / limit);
    console.log("SWITCH LOGS:", logs);
    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting switch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSwitchById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Switch.getById(id);

    if (!data) return res.status(404).json({ message: "Switch not found" });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting switch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createSwitch = async (req, res) => {
  try {
    const {
      name,
      ip,
      type,
      location,
      locationDetail,
      controllerId,
      status,
      detail,
      code,
      merk,
    } = req.body;
    const image = req.file ? req.file.filename : null;

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
      controllerId,
      status,
      detail,
      code,
      merk,
      image,
    };

    await Switch.create(newData);
    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "switch",
      action: "create",
      targetId: id,
      description: `Created Switch ${name}`,
      newData,
    });

    res.status(201).json({ message: "Switch created", id });
  } catch (error) {
    console.error("Error creating switch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateSwitch = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      ip,
      type,
      location,
      locationDetail,
      controllerId,
      status,
      detail,
      code,
      merk,
    } = req.body;

    if (!id) return res.status(400).json({ message: "Switch ID is required" });
    const oldData = await Switch.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Switch not found" });
    }
    const newImage = req.file ? req.file.filename : null;

    if (newImage && oldData.image) {
      deleteImage(oldData.image);
    }
    const newData = {
      name,
      ip,
      type,
      location,
      locationDetail,
      controllerId,
      merk,
      status,
      detail,
      code,
      image: newImage || oldData.image,
    };

    const affectedRows = await Switch.update(id, newData);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Switch not found" });

    await activityLogHelper({
      userId: req.user?.id,
      module: "switch",
      action: "update",
      targetId: id,
      description: `Updated Switch ${name || oldData.name}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "Switch updated" });
  } catch (error) {
    console.error("Error updating switch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSwitch = async (req, res) => {
  try {
    const { id } = req.params;
    const oldData = await Switch.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Switch not found" });
    }
    if (oldData.image) {
      deleteImage(oldData.image);
    }

    const affectedRows = await Switch.delete(id);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Switch not found" });

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "switch",
      action: "delete",
      targetId: id,
      description: `Deleted Switch ${oldData.name}`,
      oldData,
    });

    res.status(200).json({ message: "Switch deleted" });
  } catch (error) {
    console.error("Error deleting switch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllSwitch,
  getSwitchById,
  createSwitch,
  updateSwitch,
  deleteSwitch,
};
