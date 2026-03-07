const express = require("express");
const router = express.Router();

const {
    getUsers,
    getUserById,
    saveUser,
    loginUser,
    updateUser,
    deleteUser
} = require("../controllers/UserController");

/* =========================
   AUTH ROUTES (MUST BE FIRST)
========================= */
router.post("/signup", saveUser);   // Signup
router.post("/login", loginUser);   // Login

/* =========================
   USER ROUTES
========================= */
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
