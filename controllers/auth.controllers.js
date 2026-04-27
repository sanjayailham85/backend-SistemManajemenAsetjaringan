const db = require("../config/db");
const { comparePassword } = require("../utils/hashPassword");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/* =========================
   LOGIN
========================= */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    const user = rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* =========================
   REGISTER (SUPERADMIN ONLY)
========================= */
const register = async (req, res) => {
  try {
    const { username, email, password, name, role } = req.body;

    if (!username || !password || !name || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // validasi role
    const allowedRoles = ["guest", "operator", "admin", "superadmin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // cek user existing
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Username or email already used",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user (PAKAI UUID dari JS, bukan MySQL)
    await db.execute(
      `INSERT INTO users 
      (id, username, password, name, role, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [uuidv4(), username, hashedPassword, name, role]
    );

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, username, name, role, createdAt FROM users"
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT id, username, name, role, createdAt FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("GET USER BY ID ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, name, role, password } = req.body;

    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let hashedPassword = user[0].password;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await db.execute(
      `UPDATE users 
       SET username = ?, name = ?, role = ?, password = ?, updatedAt = NOW()
       WHERE id = ?`,
      [username, name, role, hashedPassword, id]
    );

    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db.execute("SELECT id FROM users WHERE id = ?", [id]);

    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await db.execute("DELETE FROM users WHERE id = ?", [id]);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  login,
  register,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
