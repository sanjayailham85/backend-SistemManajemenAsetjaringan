const Physical = require("../models/physical.model");
const Rack = require("../models/rack.model");
const Host = require("../models/host.model");
const activityLogHelper = require("../helpers/activityLog.helper");
const { v4: uuidv4 } = require("uuid");
const { deleteImage } = require("../helpers/file.helper");

const getAllPhysical = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await Physical.getAll(limit, offset);
    const total = await Physical.getCount();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting physical servers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPhysicalById = async (req, res) => {
  try {
    const { id } = req.params;

    const physical = await Physical.getById(id);
    if (!physical)
      return res.status(404).json({ message: "Physical server not found" });

    let rack = null;
    if (physical.rackId) {
      rack = await Rack.getById(physical.rackId);
    }

    const result = {
      id: physical.id,
      name: physical.name,
      ip: physical.ip,
      authUsername: physical.authUsername,
      authPassword: physical.authPassword,
      owner: physical.owner,
      ownerContact: physical.ownerContact,
      year: physical.year,
      model: physical.model,
      cpu: physical.cpu,
      ram: physical.ram,
      storage: physical.storage,
      status: physical.status,
      detail: physical.detail,
      image: physical.image || null,
      category: physical.category,
      createdAt: physical.createdAt,
      updatedAt: physical.updatedAt,
      rack: rack
        ? {
            id: rack.id,
            name: rack.name,
          }
        : null,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting physical server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPhysical = async (req, res) => {
  try {
    const {
      name,
      ip,
      rackId,
      authUsername,
      authPassword,
      owner,
      ownerContact,
      year,
      status,
      model,
      cpu,
      ram,
      storage,
      category,
      detail,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!name || !ip || !rackId)
      return res
        .status(400)
        .json({ message: "Name, IP, and Rack ID are required" });

    const id = uuidv4();

    const newData = {
      id,
      name,
      ip,
      rackId,
      authUsername: authUsername || null,
      authPassword: authPassword || null,
      owner: owner || null,
      ownerContact: ownerContact || null,
      year: year || null,
      status: status || null,
      model: model || null,
      cpu: cpu || null,
      ram: ram || null,
      storage: storage || null,
      detail: detail || null,
      image: image,
      category: category,
    };

    await Physical.create(newData);
    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "physical",
      action: "create",
      targetId: id,
      description: `Created Physical Server ${name}`,
      newData,
    });

    res.status(201).json({ message: "Physical server created", id });
  } catch (error) {
    console.error("Error creating physical server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePhysical = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      ip,
      rackId,
      authUsername,
      authPassword,
      owner,
      ownerContact,
      year,
      status,
      model,
      cpu,
      ram,
      storage,
      detail,
      category,
    } = req.body;
    if (!id)
      return res.status(400).json({ message: "Physical ID is required" });

    const oldData = await Physical.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Physical not found" });
    }

    const newData = {
      name,
      ip,
      rackId,
      authUsername,
      authPassword,
      owner,
      ownerContact,
      year,
      status,
      model,
      cpu,
      ram,
      storage,
      detail,
      category,
    };

    const image = req.file ? req.file.filename : undefined;

    // Hapus image lama jika ada file baru
    if (image && oldData.image) {
      deleteImage(oldData.image);
    }
    const affectedRows = await Physical.update(id, newData);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Guest server not found" });

    await activityLogHelper({
      userId: req.user?.id,
      module: "physical",
      action: "update",
      targetId: id,
      description: `Updated Physical ${name || oldData.name}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "Physical server updated" });
  } catch (error) {
    console.error("Error updating physical server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePhysical = async (req, res) => {
  try {
    const { id } = req.params;
    const oldData = await Physical.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Physical not found" });
    }

    const hosts = await Host.getByPhysicalId(id);

    if (hosts && hosts.length > 0) {
      return res.status(400).json({
        code: "PHYSICAL_NOT_EMPTY",
        message: "Physical tidak dapat dihapus karena masih berisi host.",
      });
    }

    const affectedRows = await Physical.delete(id);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Physical server not found" });

    if (!oldData)
      return res.status(404).json({ message: "Physical server not found" });

    // Hapus image lama jika ada
    if (oldData.image) {
      deleteImage(oldData.image);
    }

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "physical",
      action: "delete",
      targetId: id,
      description: `Deleted Physical Server ${oldData.name}`,
      oldData,
    });

    res.status(200).json({ message: "Physical server deleted" });
  } catch (error) {
    console.error("Error deleting physical server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllPhysical,
  getPhysicalById,
  createPhysical,
  updatePhysical,
  deletePhysical,
};
