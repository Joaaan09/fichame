const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");
const { auth } = require("../middlewares/auth");

// Rutas de categorias
router.post("/create", auth, CategoryController.create);
router.get("/list", auth, CategoryController.list);
router.delete("/remove/:id", auth, CategoryController.remove);
router.put("/update/:id", auth, CategoryController.update);

// Exportar rutas
module.exports = router;