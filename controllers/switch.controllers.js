const Switch = require("../models/switch.model");
const { v4: uuidv4 } = require("uuid");

const getAllSwitch = async (req, res) => {
  try {
    const data = await Switch.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting switch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSwitchById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Switch.getById(id);

    if (!data) return res.status(404).json({ message: "Switch not found" });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting switch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createSwitch = async (req, res) => {
  try {
    const { name, ip, type, location, locationDetail, status, code } = req.body;

    if (!name || !ip)
      return res.status(400).json({ message: "Name and IP are required" });

    const id = uuidv4();

    await Switch.create({
      id,
      name,
      ip,
      type,
      location,
      locationDetail,
      status,
      code,
    });

    res.status(201).json({ message: "Switch created", id });
  } catch (error) {
    console.error("Error creating switch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateSwitch = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, ip, type, location, locationDetail, status, code } = req.body;

    if (!id) return res.status(400).json({ message: "Switch ID is required" });

    const affectedRows = await Switch.update(id, {
      name,
      ip,
      type,
      location,
      locationDetail,
      status,
      code,
    });

    if (affectedRows === 0)
      return res.status(404).json({ message: "Switch not found" });

    res.status(200).json({ message: "Switch updated" });
  } catch (error) {
    console.error("Error updating switch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSwitch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Switch ID is required" });

    const affectedRows = await Switch.delete(id);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Switch not found" });

    res.status(200).json({ message: "Switch deleted" });
  } catch (error) {
    console.error("Error deleting switch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllSwitch,
  getSwitchById,
  createSwitch,
  updateSwitch,
  deleteSwitch,
};
