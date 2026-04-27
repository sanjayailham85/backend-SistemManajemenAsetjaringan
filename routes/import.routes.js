const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const { importModule } = require("../controllers/import.controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), importModule);

module.exports = router;
