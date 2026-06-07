const express = require("express");
const router = express.Router();
const cctvController = require("../controllers/cctv.controllers");
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, cctvController.getAllCCTV);
router.get("/:id", authMiddleware, cctvController.getCCTVById);
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  cctvController.createCCTV
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  cctvController.updateCCTV
);
router.delete("/:id", authMiddleware, cctvController.deleteCCTV);

module.exports = router;
