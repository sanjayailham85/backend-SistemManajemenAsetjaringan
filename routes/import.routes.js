const express = require("express");
const router = express.Router();

const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");

const { importModule } = require("../controllers/import.controller");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", authMiddleware, upload.single("file"), importModule);

module.exports = router;
