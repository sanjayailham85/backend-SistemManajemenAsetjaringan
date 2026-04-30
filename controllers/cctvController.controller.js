const CCTV = require("../models/cctv.model");
const CCTVController = require("../models/cctvController.model");
const CCTVMerk = require("../models/cctvMerk.model");
const { v4: uuidv4 } = require("uuid");

const getAll = async (req, res) => {
  try {
    let { page, limit, merkId } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await CCTVController.getAll(limit, offset, merkId);
    const total = await CCTVController.getCount(merkId);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting CCTVControllers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const cctvController = await CCTVController.getById(id);
    if (!cctvController) {
      return res.status(404).json({ message: "Controller not found" });
    }
    let merk = null;
    if (cctvController.merkId) {
      merk = await CCTVMerk.getById(cctvController.merkId);
    }

    const result = {
      id: cctvController.id,
      ip: cctvController.ip,
      merk: merk
        ? {
            id: merk.id,
            name: merk.name,
          }
        : null,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting Merk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req, res) => {
  try {
    const { ip, merkId } = req.body;

    if (!ip) {
      return res.status(400).json({
        message: "Name are required",
      });
    }

    const id = uuidv4();

    await CCTVController.create({
      id,
      ip,
      merkId,
    });

    res.status(201).json({
      message: "Merk created",
      id,
      merkId,
    });
  } catch (error) {
    console.error("Error creating Merk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ip, merkId } = req.body;

    const existingMerk = await CCTVController.getById(id);
    if (!existingMerk) {
      return res.status(404).json({ message: "Merk not found" });
    }

    await CCTVController.update(id, {
      ip,
      merkId,
    });

    res.status(200).json({
      message: "Merk updated",
    });
  } catch (error) {
    console.error("Error updating Merk:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCCTVController = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMerk = await CCTVController.getById(id);
    if (!existingMerk) {
      return res.status(404).json({ message: "Merk not found" });
    }
    const cctv = await CCTV.getByControllerId(id);

    if (cctv && cctv.length > 0) {
      return res.status(400).json({
        code: "CCTV_NOT_EMPTY",
        message: "Tidak dapat dihapus karena masih berisi Perangkat.",
      });
    }

    await CCTVController.delete(id);

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
  deleteCCTVController,
};
