const express = require("express");
const router = express.Router();

const lisensiController = require("../controllers/lisensi.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, lisensiController.getAll);
router.get("/:id", authMiddleware, lisensiController.getById);

router.post("/", authMiddleware, lisensiController.create);
router.put("/:id", authMiddleware, lisensiController.update);
router.delete("/:id", authMiddleware, lisensiController.deleteLisensi);

module.exports = router;
