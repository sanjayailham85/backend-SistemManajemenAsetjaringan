const Merk = require("../models/merk.model");
const { v4: uuidv4 } = require("uuid");

const getAllMerk = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await Merk.getAll(limit, offset);
    const total = await Merk.getCount();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting Merks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMerkById = async (req, res) => {
  try {
    const { id } = req.params;

    const merk = await Merk.getMerkById(id);
    if (!merk) {
      return res.status(404).json({ message: "Merk not found" });
    }

    res.status(200).json(merk);
  } catch (error) {
    console.error("Error getting Merk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createMerk = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name are required",
      });
    }

    const id = uuidv4();

    await Merk.create({
      id,
      name,
      category,
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

const updateMerk = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const existingMerk = await Merk.getMerkById(id);
    if (!existingMerk) {
      return res.status(404).json({ message: "Merk not found" });
    }

    await Merk.update(id, {
      name,
      category,
    });

    res.status(200).json({
      message: "Merk updated",
    });
  } catch (error) {
    console.error("Error updating Merk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMerk = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMerk = await Merk.getMerkById(id);
    if (!existingMerk) {
      return res.status(404).json({ message: "Merk not found" });
    }

    await Merk.delete(id);

    res.status(200).json({
      message: "Merk deleted",
    });
  } catch (error) {
    console.error("Error deleting Merk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllMerk,
  getMerkById,
  createMerk,
  updateMerk,
  deleteMerk,
};
