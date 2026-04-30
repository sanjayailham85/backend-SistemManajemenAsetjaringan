const IPList = require("../models/ipList.model");
const activityLogHelper = require("../helpers/activityLog.helper");
const { v4: uuidv4 } = require("uuid");

const getAll = async (req, res) => {
  try {
    let { page, limit, controllerId } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await IPList.getAll(limit, offset, controllerId);
    const total = await IPList.getCount(controllerId);

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

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const ip = await IPList.getById(id);

    if (!ip) {
      return res.status(404).json({ message: "IPList not found" });
    }

    res.status(200).json(ip);
  } catch (error) {
    console.error("Error getting access point:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req, res) => {
  try {
    const { ip, lisensi, is_ssl, domain } = req.body;

    if (!ip) {
      return res.status(400).json({ message: "ip are required" });
    }

    const id = uuidv4();

    const newData = {
      id,
      ip,
      lisensi,
      is_ssl,
      domain,
    };

    await IPList.create(newData);

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "accessPoint",
      action: "create",
      targetId: id,
      description: `Created IPList ${ip}`,
      newData,
    });

    res.status(201).json({ message: "IPList created", id });
  } catch (error) {
    console.error("Error creating IPList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const { ip, lisensi, is_ssl, domain } = req.body;

    const oldData = await IPList.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "IPList not found" });
    }

    const newData = {
      ip,
      lisensi,
      is_ssl,
      domain,
    };

    await IPList.update(id, newData);

    await activityLogHelper({
      userId: req.user?.id,
      module: "accessPoint",
      action: "update",
      targetId: id,
      description: `Updated IPList ${ip || oldData.ip}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "IPList updated" });
  } catch (error) {
    console.error("Error updating IPList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteIP = async (req, res) => {
  try {
    const { id } = req.params;

    const oldData = await IPList.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "IPList not found" });
    }

    await IPList.delete(id);

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "accessPoint",
      action: "delete",
      targetId: id,
      description: `Deleted IPList ${oldData.ip}`,
      oldData,
    });

    res.status(200).json({ message: "IPList deleted" });
  } catch (error) {
    console.error("Error deleting IPList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteIP,
};
