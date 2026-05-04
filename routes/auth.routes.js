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
  updatePassword,
  deleteUser,
} = require("../controllers/auth.controllers");

router.post("/login", login);

router.post(
  "/register",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  register
);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  getAllUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  getUserById
);

router.put("/users/updatePassword", authMiddleware, updatePassword);
router.put(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  updateUser
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  deleteUser
);

module.exports = router;
