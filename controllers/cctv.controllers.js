const CCTV = require("../models/cctv.model");
const { v4: uuidv4 } = require("uuid");

const getAllCCTV = async (req, res) => {
  try {
    const data = await CCTV.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting CCTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCCTVById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CCTV.getById(id);

    if (!data) return res.status(404).json({ message: "CCTV not found" });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting CCTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createCCTV = async (req, res) => {
  try {
    const { name, ip, type, location, locationDetail, status, detail, code } =
      req.body;

    if (!name || !ip)
      return res.status(400).json({ message: "Name and IP are required" });

    const id = uuidv4();
    await CCTV.create({
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

    res.status(201).json({ message: "CCTV created", id });
  } catch (error) {
    console.error("Error creating CCTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCCTV = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, ip, type, location, locationDetail, status, detail, code } =
      req.body;

    if (!id) return res.status(400).json({ message: "CCTV ID is required" });

    const affectedRows = await CCTV.update(id, {
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
      return res.status(404).json({ message: "CCTV not found" });

    res.status(200).json({ message: "CCTV updated" });
  } catch (error) {
    console.error("Error updating CCTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCCTV = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "CCTV ID is required" });

    const affectedRows = await CCTV.delete(id);

    if (affectedRows === 0)
      return res.status(404).json({ message: "CCTV not found" });

    res.status(200).json({ message: "CCTV deleted" });
  } catch (error) {
    console.error("Error deleting CCTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCCTV,
  getCCTVById,
  createCCTV,
  updateCCTV,
  deleteCCTV,
};
