const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { auth } = require("../middlewares/auth");

// Definir rutas
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/update", auth, UserController.update);

module.exports = router;