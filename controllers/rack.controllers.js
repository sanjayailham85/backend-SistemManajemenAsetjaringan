const Rack = require("../models/rack.model");
const { v4: uuidv4 } = require("uuid");

const getAllRacks = async (req, res) => {
  try {
    const rack = await Rack.getAll();
    res.status(200).json(rack);
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
    await Rack.create({ id, name, location });
    res.status(201).json({ message: "Rack created", id });
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

    const affectedRows = await Rack.update(id, { name, location });
    if (affectedRows === 0)
      return res.status(404).json({ message: "Rack not found" });

    res.status(200).json({ message: "Rack updated" });
  } catch (error) {
    console.error("Error updating rack:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRack = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Rack ID is required" });

    const affectedRows = await Rack.delete(id);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Rack not found" });

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
