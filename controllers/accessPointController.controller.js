const AccessPoint = require("../models/accessPoint.model");
const AccessPointController = require("../models/accessPointController.model");
const AccessPointMerk = require("../models/accessPointMerk.model");
const { v4: uuidv4 } = require("uuid");

const getAll = async (req, res) => {
  try {
    let { page, limit, merkId } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await AccessPointController.getAll(limit, offset, merkId);
    const total = await AccessPointController.getCount(merkId);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting AccessPointControllers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const accessPointController = await AccessPointController.getById(id);
    if (!accessPointController) {
      return res.status(404).json({ message: "Controller not found" });
    }
    let merk = null;
    if (accessPointController.merkId) {
      merk = await AccessPointMerk.getById(accessPointController.merkId);
    }

    const result = {
      id: accessPointController.id,
      ip: accessPointController.ip,
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

    await AccessPointController.create({
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

    const existingMerk = await AccessPointController.getById(id);
    if (!existingMerk) {
      return res.status(404).json({ message: "Merk not found" });
    }

    await AccessPointController.update(id, {
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

const deleteAccessPointController = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMerk = await AccessPointController.getById(id);
    if (!existingMerk) {
      return res.status(404).json({ message: "Merk not found" });
    }
    const accessPoint = await AccessPoint.getByControllerId(id);

    if (accessPoint && accessPoint.length > 0) {
      return res.status(400).json({
        code: "AP_NOT_EMPTY",
        message: "Tidak dapat dihapus karena masih berisi Perangkat.",
      });
    }

    await AccessPointController.delete(id);

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
  deleteAccessPointController,
};
