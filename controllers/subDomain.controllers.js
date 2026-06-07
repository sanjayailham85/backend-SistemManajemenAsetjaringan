const SubDomain = require("../models/subDomain.model");
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

    const logs = await SubDomain.getAll(limit, offset);
    const total = await SubDomain.getCount();

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

    const subDomain = await SubDomain.getById(id);

    if (!subDomain) {
      return res.status(404).json({ message: "SubDomain not found" });
    }

    res.status(200).json(subDomain);
  } catch (error) {
    console.error("Error getting access point:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "ip are required" });
    }

    const id = uuidv4();

    const newData = {
      id,
      name,
    };

    await SubDomain.create(newData);

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "subDomain",
      action: "create",
      targetId: id,
      description: `Created SubDomain ${name}`,
      newData,
    });

    res.status(201).json({ message: "SubDomain created", id });
  } catch (error) {
    console.error("Error creating SubDomain:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    const oldData = await SubDomain.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "SubDomain not found" });
    }

    const newData = {
      name,
    };

    await SubDomain.update(id, newData);

    await activityLogHelper({
      userId: req.user?.id,
      module: "subDomain",
      action: "update",
      targetId: id,
      description: `Updated SubDomain ${name || oldData.name}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "SubDomain updated" });
  } catch (error) {
    console.error("Error updating SubDomain:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSubDomain = async (req, res) => {
  try {
    const { id } = req.params;

    const oldData = await SubDomain.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "SubDomain not found" });
    }

    await SubDomain.delete(id);

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "subDomain",
      action: "delete",
      targetId: id,
      description: `Deleted SubDomain ${oldData.name}`,
      oldData,
    });

    res.status(200).json({ message: "SubDomain deleted" });
  } catch (error) {
    console.error("Error deleting SubDomain:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteSubDomain,
};
