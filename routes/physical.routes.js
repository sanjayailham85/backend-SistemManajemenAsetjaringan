const express = require("express");
const router = express.Router();
const physicalController = require("../controllers/physical.controllers");
const upload = require("../middlewares/upload.middleware");

router.get("/", physicalController.getAllPhysical);
router.get("/:id", physicalController.getPhysicalById);

router.post("/", upload.single("image"), physicalController.createPhysical);
router.put("/:id", upload.single("image"), physicalController.updatePhysical);

router.delete("/:id", physicalController.deletePhysical);

module.exports = router;
