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
      name: guest.name,
      ip: guest.ip,
      authUsername: guest.authUsername,
      authPassword: guest.authPassword,
      status: guest.status,
      cpu: guest.cpu,
      ram: guest.ram,
      storage: guest.storage,
      detail: guest.detail,
      auth: guest.auth,
      osVersion: guest.osVersion,
      domainInstance: guest.domainInstance,
      model: guest.model,
      createdAt: physical.createdAt,
      updatedAt: physical.updatedAt,
      host: host
        ? {
            id: host.id,
            name: host.name,
            ip: host.ip,
            authUsername: host.authUsername,
            authPassword: host.authPassword,
            version: host.version,
            serverDevice: host.serverDevice,
            status: host.status,
            detail: host.detail,
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
      name,
      ip,
      hostId,
      authUsername,
      authPassword,
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

    if (!name || !ip || !hostId)
      return res
        .status(400)
        .json({ message: "Name, IP, and Host ID are required" });

    const id = uuidv4();
    await Guest.create({
      id,
      name,
      ip,
      hostId,
      authUsername,
      authPassword,
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
      name,
      ip,
      hostId,
      authUsername,
      authPassword,
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
      name,
      ip,
      hostId,
      authUsername,
      authPassword,
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
