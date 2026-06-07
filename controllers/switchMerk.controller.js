const SwitchController = require("../models/switchController.model");
const SwitchMerk = require("../models/switchMerk.model");
const { v4: uuidv4 } = require("uuid");

const getAll = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await SwitchMerk.getAll(limit, offset);
    const total = await SwitchMerk.getCount();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting SwitchMerks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const merk = await SwitchMerk.getById(id);
    if (!merk) {
      return res.status(404).json({ message: "Merk not found" });
    }

    res.status(200).json(merk);
  } catch (error) {
    console.error("Error getting Merk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name are required",
      });
    }

    const id = uuidv4();

    await SwitchMerk.create({
      id,
      name,
    });

    res.status(201).json({
      message: "Merk created",
      id,
    });
  } catch (error) {
    console.error("Error creating Merk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existingMerk = await SwitchMerk.getById(id);
    if (!existingMerk) {
      return res.status(404).json({ message: "Merk not found" });
    }

    await SwitchMerk.update(id, {
      name,
    });

    res.status(200).json({
      message: "Merk updated",
    });
  } catch (error) {
    console.error("Error updating Merk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSwitchMerk = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMerk = await SwitchMerk.getById(id);
    if (!existingMerk) {
      return res.status(404).json({ message: "Merk not found" });
    }
    const controllers = await SwitchController.getByMerkId(id);

    if (controllers && controllers.length > 0) {
      return res.status(400).json({
        code: "CONTROLLERS_NOT_EMPTY",
        message: "Tidak dapat dihapus karena masih berisi Perangkat.",
      });
    }

    await SwitchMerk.delete(id);

    res.status(200).json({
      message: "Merk deleted",
    });
  } catch (error) {
    console.error("Error deleting Merk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteSwitchMerk,
};
