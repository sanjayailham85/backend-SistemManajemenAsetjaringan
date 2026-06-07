const Lisensi = require("../models/lisensi.model");
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

    const logs = await Lisensi.getAll(limit, offset);
    const total = await Lisensi.getCount();

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

    const lisensi = await Lisensi.getById(id);

    if (!lisensi) {
      return res.status(404).json({ message: "Lisensi not found" });
    }

    res.status(200).json(lisensi);
  } catch (error) {
    console.error("Error getting access point:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req, res) => {
  try {
    const { name, expiredDate } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name are required" });
    }

    const id = uuidv4();

    const newData = {
      id,
      name,
      expiredDate,
    };

    await Lisensi.create(newData);

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "lisensi",
      action: "create",
      targetId: id,
      description: `Created Lisensi ${name}`,
      newData,
    });

    res.status(201).json({ message: "Lisensi created", id });
  } catch (error) {
    console.error("Error creating Lisensi:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, expiredDate } = req.body;

    const oldData = await Lisensi.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Lisensi not found" });
    }

    const newData = {
      name,
      expiredDate,
    };

    await Lisensi.update(id, newData);

    await activityLogHelper({
      userId: req.user?.id,
      module: "lisensi",
      action: "update",
      targetId: id,
      description: `Updated Lisensi ${name || oldData.name}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "Lisensi updated" });
  } catch (error) {
    console.error("Error updating Lisensi:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteLisensi = async (req, res) => {
  try {
    const { id } = req.params;

    const oldData = await Lisensi.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Lisensi not found" });
    }

    await Lisensi.delete(id);

    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "lisensi",
      action: "delete",
      targetId: id,
      description: `Deleted Lisensi ${oldData.name}`,
      oldData,
    });

    res.status(200).json({ message: "Lisensi deleted" });
  } catch (error) {
    console.error("Error deleting Lisensi:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteLisensi,
};
