const Location = require("../models/location.model");
const { v4: uuidv4 } = require("uuid");

const getAllLocation = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await Location.getAll(limit, offset);
    const total = await Location.getCount();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting Locations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.getLocationById(id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error("Error getting Location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createLocation = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name are required",
      });
    }

    const id = uuidv4();

    await Location.create({
      id,
      name,
    });

    res.status(201).json({
      message: "Location created",
      id,
    });
  } catch (error) {
    console.error("Error creating Location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existingLocation = await Location.getLocationById(id);
    if (!existingLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    await Location.update(id, {
      name,
    });

    res.status(200).json({
      message: "Location updated",
    });
  } catch (error) {
    console.error("Error updating Location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLocation = await Location.getLocationById(id);
    if (!existingLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    await Location.delete(id);

    res.status(200).json({
      message: "Location deleted",
    });
  } catch (error) {
    console.error("Error deleting Location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllLocation,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
