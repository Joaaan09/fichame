const express = require("express");
const router = express.Router();
const WorkSessionController = require("../controllers/WorkSessionController");
const { auth } = require("../middlewares/auth");

// Definir rutas
router.post("/start", auth, WorkSessionController.start);
router.post("/end", auth, WorkSessionController.end);
router.post("/create", auth, WorkSessionController.create);
router.put("/update/:id", auth, WorkSessionController.update);
router.get("/list", auth, WorkSessionController.list);
router.delete("/remove/:id", auth, WorkSessionController.remove);

// Exportar router
module.exports = router;