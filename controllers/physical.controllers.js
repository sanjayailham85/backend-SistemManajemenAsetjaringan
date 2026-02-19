const Physical = require("../models/physical.model");
const Rack = require("../models/rack.model");
const { v4: uuidv4 } = require("uuid");
const { deleteImage } = require("../helpers/file.helper");

const getAllPhysical = async (req, res) => {
  try {
    const servers = await Physical.getAll();
    res.status(200).json(servers);
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
      detail,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!name || !ip || !rackId)
      return res
        .status(400)
        .json({ message: "Name, IP, and Rack ID are required" });

    const id = uuidv4();

    await Physical.create({
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

    const existingPhysical = await Physical.getById(id);
    if (!existingPhysical)
      return res.status(404).json({ message: "Physical server not found" });

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
    } = req.body;

    const image = req.file ? req.file.filename : undefined;

    // Hapus image lama jika ada file baru
    if (image && existingPhysical.image) {
      deleteImage(existingPhysical.image);
    }

    const affectedRows = await Physical.update(id, {
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
      ...(image && { image }),
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

    const existingPhysical = await Physical.getById(id);
    if (!existingPhysical)
      return res.status(404).json({ message: "Physical server not found" });

    // Hapus image lama jika ada
    if (existingPhysical.image) {
      deleteImage(existingPhysical.image);
    }

    const affectedRows = await Physical.delete(id);

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
