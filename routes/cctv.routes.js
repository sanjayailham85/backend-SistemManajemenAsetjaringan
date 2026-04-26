const express = require("express");
const router = express.Router();
const cctvController = require("../controllers/cctv.controllers");

router.get("/", cctvController.getAllCCTV);
router.get("/:id", cctvController.getCCTVById);
router.post("/", cctvController.createCCTV);
router.put("/:id", cctvController.updateCCTV);
router.delete("/:id", cctvController.deleteCCTV);

module.exports = router;
