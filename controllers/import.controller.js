const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { importData } = require("../services/import/import.service");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const importModule = async (req, res) => {
  try {
    const module = req.body.module;
    const fileBuffer = req.file?.buffer;

    if (!module) {
      return res.status(400).json({ message: "Module kosong" });
    }

    if (!fileBuffer) {
      return res.status(400).json({ message: "File tidak ada" });
    }

    const result = await importData(module, fileBuffer);

    return res.json(result);
  } catch (error) {
    console.error("IMPORT ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { importModule };
