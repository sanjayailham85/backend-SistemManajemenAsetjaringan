const Host = require("../models/host.model");
const Physical = require("../models/physical.model");
const Rack = require("../models/rack.model");
const activityLogHelper = require("../helpers/activityLog.helper");
const { v4: uuidv4 } = require("uuid");

const getAllHost = async (req, res) => {
  try {
    const servers = await Host.getAll();
    res.status(200).json(servers);
  } catch (error) {
    console.error("Error getting host servers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getHostById = async (req, res) => {
  try {
    const { id } = req.params;

    const host = await Host.getById(id);
    if (!host)
      return res.status(404).json({ message: "Host server not found" });

    const physical = await Physical.getById(host.physicalId);
    let rack = null;

    if (physical) {
      rack = await Rack.getById(physical.rackId);
    }

    const result = {
      id: host.id,
      name: host.name,
      ip: host.ip,
      authUsername: host.authUsername,
      authPassword: host.authPassword,
      version: host.version,
      serverDevice: host.serverDevice,
      status: host.status,
      detail: host.detail,
      osName: host.osName,
      osVersion: host.osVersion,
      category: host.category,
      createdAt: physical.createdAt,
      updatedAt: physical.updatedAt,
      physical: physical
        ? {
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
          }
        : null,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting host server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createHost = async (req, res) => {
  try {
    const {
      name,
      ip,
      physicalId,
      authUsername,
      authPassword,
      version,
      serverDevice,
      status,
      detail,
    } = req.body;

    if (!name || !ip || !physicalId)
      return res
        .status(400)
        .json({ message: "Name, IP, and Physical ID are required" });

    const id = uuidv4();
    const newData = {
      id,
      name,
      ip,
      physicalId,
      authUsername,
      authPassword,
      version,
      serverDevice,
      status,
      detail,
    };

    await Host.create(newData);
    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "host",
      action: "create",
      targetId: id,
      description: `Created Host ${name}`,
      newData,
    });

    res.status(201).json({ message: "Host server created", id });
  } catch (error) {
    console.error("Error creating host server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateHost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      ip,
      physicalId,
      authUsername,
      authPassword,
      version,
      serverDevice,
      status,
      detail,
    } = req.body;

    const oldData = await Host.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Host not found" });
    }

    const newData = {
      name,
      ip,
      physicalId,
      authUsername,
      authPassword,
      version,
      serverDevice,
      status,
      detail,
    };

    const affectedRows = await Host.update(id, newData);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Host server not found" });

    await activityLogHelper({
      userId: req.user?.id,
      module: "host",
      action: "update",
      targetId: id,
      description: `Updated Host ${name || oldData.name}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "Host server updated" });
  } catch (error) {
    console.error("Error updating host server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteHost = async (req, res) => {
  try {
    const { id } = req.params;
    const oldData = await Host.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Host not found" });
    }

    const affectedRows = await Host.delete(id);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Host server not found" });

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "host",
      action: "delete",
      targetId: id,
      description: `Deleted Host ${oldData.name}`,
      oldData,
    });

    res.status(200).json({ message: "Host server deleted" });
  } catch (error) {
    console.error("Error deleting host server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllHost,
  getHostById,
  createHost,
  updateHost,
  deleteHost,
};
