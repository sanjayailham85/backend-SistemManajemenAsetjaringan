const Switch = require("../models/switch.model");
const SwitchController = require("../models/switchController.model");
const SwitchMerk = require("../models/switchMerk.model");
const { v4: uuidv4 } = require("uuid");

const getAll = async (req, res) => {
  try {
    let { page, limit, merkId } = req.query;

    page = Number(page);
    limit = Number(limit);

    page = Number.isInteger(page) && page > 0 ? page : 1;
    limit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    const offset = (page - 1) * limit;

    const logs = await SwitchController.getAll(limit, offset, merkId);
    const total = await SwitchController.getCount(merkId);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: logs,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting SwitchControllers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const switchController = await SwitchController.getById(id);
    if (!switchController) {
      return res.status(404).json({ message: "Controller not found" });
    }
    let merk = null;
    if (switchController.merkId) {
      merk = await SwitchMerk.getById(switchController.merkId);
    }

    const result = {
      id: switchController.id,
      ip: switchController.ip,
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

    await SwitchController.create({
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

    const existingMerk = await SwitchController.getById(id);
    if (!existingMerk) {
      return res.status(404).json({ message: "Merk not found" });
    }

    await SwitchController.update(id, {
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

const deleteSwitchController = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMerk = await SwitchController.getById(id);
    if (!existingMerk) {
      return res.status(404).json({ message: "Merk not found" });
    }
    const switchDevice = await Switch.getByControllerId(id);

    if (switchDevice && switchDevice.length > 0) {
      return res.status(400).json({
        code: "Switch_NOT_EMPTY",
        message: "Tidak dapat dihapus karena masih berisi Perangkat.",
      });
    }

    await SwitchController.delete(id);

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
  deleteSwitchController,
};
