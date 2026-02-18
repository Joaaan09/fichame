// Importar dependencias y módulos
const User = require('../models/User.js');
const bcrypt = require("bcryptjs");
const validate = require("../helpers/validate");

// Registrar usuario
const register = async (req, res) => {

    try {

        let params = req.body;

        // Comprobar que los datos lleguen correctamente
        if (!params.name || !params.email || !params.password) {
            return res.status(400).json({ message: "Faltan datos por enviar" });
        }

        // Validar los datos
        if (!validate(params)) {
            return res.status(400).json({ message: "Datos no válidos" });
        }

        // Creamos el objeto del usuario
        let user_to_save = new User(params);

        // Control de usuarios duplicados
        const users = await User.find({
            $or: [
                { email: user_to_save.email.toLowerCase() }
            ]
        });

        if (users && users.length >= 1) {
            return res.status(200).json({
                status: "error",
                message: "El usuario ya existe"
            });
        };

        // Cifrar la contraseña con bycript
        bcrypt.hash(user_to_save.password, 10, async (error, pwd) => {
            user_to_save.password = pwd;

            // Guardar el usuario en la BD
            const userStored = await user_to_save.save();

            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado correctamente",
                user: {
                    id: userStored._id,
                    name: userStored.name,
                    email: userStored.email
                }
            });
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al registrar usuario"
        });
    }
}


// Exportar las funciones
module.exports = {
    register
};