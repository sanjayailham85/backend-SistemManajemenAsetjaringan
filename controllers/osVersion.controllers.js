const OsVersion = require("../models/osVersion.model");
const { v4: uuidv4 } = require("uuid");

const getAllOsVersion = async (req, res) => {
  try {
    const osVersions = await OsVersion.getAll();
    res.status(200).json(osVersions);
  } catch (error) {
    console.error("Error getting OS versions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOsVersionById = async (req, res) => {
  try {
    const { id } = req.params;

    const osVersion = await OsVersion.getById(id);
    if (!osVersion) {
      return res.status(404).json({ message: "OS version not found" });
    }

    res.status(200).json(osVersion);
  } catch (error) {
    console.error("Error getting OS version:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createOsVersion = async (req, res) => {
  try {
    const { name, version } = req.body;

    if (!name || !version) {
      return res.status(400).json({
        message: "Name and version are required",
      });
    }

    const id = uuidv4();

    await OsVersion.create({
      id,
      name,
      version,
    });

    res.status(201).json({
      message: "OS version created",
      id,
    });
  } catch (error) {
    console.error("Error creating OS version:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOsVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, version } = req.body;

    const existingOsVersion = await OsVersion.getById(id);
    if (!existingOsVersion) {
      return res.status(404).json({ message: "OS version not found" });
    }

    await OsVersion.update(id, {
      name,
      version,
    });

    res.status(200).json({
      message: "OS version updated",
    });
  } catch (error) {
    console.error("Error updating OS version:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteOsVersion = async (req, res) => {
  try {
    const { id } = req.params;

    const existingOsVersion = await OsVersion.getById(id);
    if (!existingOsVersion) {
      return res.status(404).json({ message: "OS version not found" });
    }

    await OsVersion.delete(id);

    res.status(200).json({
      message: "OS version deleted",
    });
  } catch (error) {
    console.error("Error deleting OS version:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllOsVersion,
  getOsVersionById,
  createOsVersion,
  updateOsVersion,
  deleteOsVersion,
};
