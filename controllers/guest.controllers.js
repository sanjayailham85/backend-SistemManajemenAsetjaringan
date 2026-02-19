const Guest = require("../models/guest.model");
const Host = require("../models/host.model");
const Physical = require("../models/physical.model");
const Rack = require("../models/rack.model");
const { v4: uuidv4 } = require("uuid");

const getAllGuest = async (req, res) => {
  try {
    const servers = await Guest.getAll();
    res.status(200).json(servers);
  } catch (error) {
    console.error("Error getting guest servers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getGuestById = async (req, res) => {
  try {
    const { id } = req.params;

    const guest = await Guest.getById(id);
    if (!guest)
      return res.status(404).json({ message: "Guest server not found" });

    const host = await Host.getById(guest.hostId);
    let physical = null;
    let rack = null;

    if (host) {
      physical = await Physical.getById(host.physicalId);

      if (physical) {
        rack = await Rack.getById(physical.rackId);
      }
    }

    const result = {
      id: guest.id,
      instanceName: guest.instanceName,
      ip: guest.ip,
      status: guest.status,
      cpu: guest.cpu,
      ram: guest.ram,
      storage: guest.storage,
      detail: guest.detail,
      auth: guest.auth,
      osVersion: guest.osVersion,
      domainInstance: guest.domainInstance,
      host: host
        ? {
            id: host.id,
            name: host.name,
            physical: physical
              ? {
                  id: physical.id,
                  name: physical.name,
                  rack: rack
                    ? {
                        id: rack.id,
                        name: rack.name,
                      }
                    : null,
                }
              : null,
          }
        : null,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting guest server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createGuest = async (req, res) => {
  try {
    const {
      instanceName,
      ip,
      hostId,
      auth,
      owner,
      domainInstance,
      ram,
      storage,
      cpu,
      model,
      osVersion,
      status,
      detail,
    } = req.body;

    if (!instanceName || !ip || !hostId)
      return res
        .status(400)
        .json({ message: "Name, IP, and Host ID are required" });

    const id = uuidv4();
    await Guest.create({
      id,
      instanceName,
      ip,
      hostId,
      auth,
      owner,
      domainInstance,
      ram,
      storage,
      cpu,
      model,
      osVersion,
      status,
      detail,
    });

    res.status(201).json({ message: "Guest server created", id });
  } catch (error) {
    console.error("Error creating guest server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      instanceName,
      ip,
      hostId,
      auth,
      owner,
      domainInstance,
      ram,
      storage,
      cpu,
      model,
      osVersion,
      status,
      detail,
    } = req.body;

    const affectedRows = await Guest.update(id, {
      instanceName,
      ip,
      hostId,
      auth,
      owner,
      domainInstance,
      ram,
      storage,
      cpu,
      model,
      osVersion,
      status,
      detail,
    });

    if (affectedRows === 0)
      return res.status(404).json({ message: "Guest server not found" });

    res.status(200).json({ message: "Guest server updated" });
  } catch (error) {
    console.error("Error updating guest server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Guest.delete(id);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Guest server not found" });

    res.status(200).json({ message: "Guest server deleted" });
  } catch (error) {
    console.error("Error deleting guest server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllGuest,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
};
