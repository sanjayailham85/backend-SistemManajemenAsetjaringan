const Router = require("../models/router.model");
const { v4: uuidv4 } = require("uuid");

const getAllRouter = async (req, res) => {
  try {
    const data = await Router.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting Router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRouterById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Router.getById(id);

    if (!data) return res.status(404).json({ message: "Router not found" });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting Router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createRouter = async (req, res) => {
  try {
    const {
      name,
      ip,

      type,
      location,
      locationDetail,
      status,
      detail,
      code,
    } = req.body;

    if (!name || !ip)
      return res.status(400).json({ message: "Name and IP are required" });

    const id = uuidv4();

    await Router.create({
      id,
      name,
      ip,
      type,
      location,
      locationDetail,
      status,
      detail,
      code,
    });

    res.status(201).json({ message: "Router created", id });
  } catch (error) {
    console.error("Error creating Router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRouter = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      ip,

      type,
      location,
      locationDetail,
      status,
      detail,
      code,
    } = req.body;

    if (!id) return res.status(400).json({ message: "Router ID is required" });

    const affectedRows = await Router.update(id, {
      name,
      ip,

      type,
      location,
      locationDetail,
      status,
      detail,
      code,
    });

    if (affectedRows === 0)
      return res.status(404).json({ message: "Router not found" });

    res.status(200).json({ message: "Router updated" });
  } catch (error) {
    console.error("Error updating Router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRouter = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Router ID is required" });

    const affectedRows = await Router.delete(id);

    if (affectedRows === 0)
      return res.status(404).json({ message: "Router not found" });

    res.status(200).json({ message: "Router deleted" });
  } catch (error) {
    console.error("Error deleting Router:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllRouter,
  getRouterById,
  createRouter,
  updateRouter,
  deleteRouter,
};
