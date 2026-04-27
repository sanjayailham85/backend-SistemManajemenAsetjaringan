const Rack = require("../models/rack.model");
const Physical = require("../models/physical.model");
const activityLogHelper = require("../helpers/activityLog.helper");
const { v4: uuidv4 } = require("uuid");

const getAllRacks = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await Rack.getAll(limit, offset);
    const total = await Rack.getCount();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting rack:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRackById = async (req, res) => {
  try {
    const { id } = req.params;
    const rack = await Rack.getById(id);
    if (!rack) return res.status(404).json({ message: "Rack not found" });
    res.status(200).json(rack);
  } catch (error) {
    console.error("Error getting rack:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createRack = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location)
      return res
        .status(400)
        .json({ message: "Name and location are required" });

    const id = uuidv4();
    const newData = {
      id,
      name,
      location,
    };
    await Rack.create(newData);
    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "rack",
      action: "create",
      targetId: id,
      description: `Created Rack ${name}`,
      newData,
    });
    res.status(200).json({ message: "Rack created", id });
  } catch (error) {
    console.error("Error creating rack:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRack = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    if (!id) return res.status(400).json({ message: "Rack ID is required" });

    const oldData = await Rack.getById(id);
    if (!oldData) {
      return res.status(404).json({ message: "Rack not found" });
    }
    const newData = {
      name,
      location,
    };

    const affectedRows = await Rack.update(id, newData);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Rack not found" });
    await activityLogHelper({
      userId: req.user?.id,
      module: "rack",
      action: "update",
      targetId: id,
      description: `Updated Rack ${name || oldData.name}`,
      oldData,
      newData,
    });

    res.status(200).json({ message: "Rack updated" });
  } catch (error) {
    console.error("Error updating rack:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRack = async (req, res) => {
  try {
    const { id } = req.params;
    const oldData = await Rack.getById(id);

    if (!oldData) {
      return res.status(404).json({ message: "Rack not found" });
    }

    const physicals = await Physical.getByRackId(id);

    if (physicals && physicals.length > 0) {
      return res.status(400).json({
        code: "RACK_NOT_EMPTY",
        message:
          "Rack tidak dapat dihapus karena masih berisi physical server.",
      });
    }

    const affectedRows = await Rack.delete(id);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Rack not found" });
    await activityLogHelper({
      userId: req.user?.id ?? req.user?.userId ?? null,
      module: "rack",
      action: "delete",
      targetId: id,
      description: `Deleted Rack ${oldData.name}`,
      oldData,
    });

    res.status(200).json({ message: "Rack deleted" });
  } catch (error) {
    console.error("Error deleting rack:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllRacks,
  getRackById,
  createRack,
  updateRack,
  deleteRack,
};
