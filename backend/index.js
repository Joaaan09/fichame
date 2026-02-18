// Importar dependencias
require("dotenv").config();
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Mensaje bienvenida
console.log("API NODE para Fichame arrancada");

// Conectar a la base de datos
connection();

// Crear servidor node
const app = express();
const puerto = process.env.PORT;

// Configurar CORS
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Cualquier dato que llegue con el formato url enconded lo codificara como un objeto js

// Rutas
// Configuración de rutas
const userRoutes = require('./routes/user');


// Rutas de usuarios
app.use("/api/user", userRoutes);


// Poner el servidor a escuchar
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto", puerto);
});
