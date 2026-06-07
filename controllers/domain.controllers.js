const Domain = require("../models/domain.model");
const activityLogHelper = require("../helpers/activityLog.helper");
const { v4: uuidv4 } = require("uuid");

const getAll = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await Domain.getAll(limit, offset);
    const total = await Domain.getCount();

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

    const domain = await Domain.getById(id);

    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    res.status(200).json(domain);
  } catch (error) {
    console.error("Error getting access point:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req, res) => {
  try {
    const { name, subDomain, author, contact, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "ip are required" });
    }

    const id = uuidv4();

    const newData = {
      id,
      name,
      subDomain,
      author,
      contact,
      status,
    };

    await Domain.create(newData);

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "domain",
      action: "create",
      targetId: id,
      description: `Created Domain ${name}`,
      newData,
    });

    res.status(201).json({ message: "Domain created", id });
  } catch (error) {
    console.error("Error creating Domain:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, subDomain, author, contact, status } = req.body;

    const oldData = await Domain.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Domain not found" });
    }

    const newData = {
      name,
      subDomain,
      author,
      contact,
      status,
    };

    await Domain.update(id, newData);

    await activityLogHelper({
      userId: req.user?.id,
      module: "domain",
      action: "update",
      targetId: id,
      description: `Updated Domain ${name || oldData.name}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "Domain updated" });
  } catch (error) {
    console.error("Error updating Domain:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteDomain = async (req, res) => {
  try {
    const { id } = req.params;

    const oldData = await Domain.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Domain not found" });
    }

    await Domain.delete(id);

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "domain",
      action: "delete",
      targetId: id,
      description: `Deleted Domain ${oldData.name}`,
      oldData,
    });

    res.status(200).json({ message: "Domain deleted" });
  } catch (error) {
    console.error("Error deleting Domain:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteDomain,
};
