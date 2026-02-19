const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// router.post("/register", authController.registerUser);
router.post("/login", authController.login);
router.post(
  "/register",
  verifyToken,
  checkRole("superadmin"),
  authController.registerUser
);

module.exports = router;
