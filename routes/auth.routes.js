const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  login,
  register,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/auth.controllers");

// =========================
// AUTH
// =========================
router.post("/login", login);

// REGISTER (superadmin only)
router.post(
  "/register",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  register
);

// =========================
// USER MANAGEMENT (superadmin only)
// =========================
router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  getAllUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  getUserById
);

router.put(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  updateUser
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  deleteUser
);

module.exports = router;
