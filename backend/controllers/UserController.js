// Importar dependencias y módulos
const User = require('../models/User.js');
const bcrypt = require("bcryptjs");
const validate = require("../helpers/validate");
const jwt = require("../services/jwt");

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

// Login de usuario
const login = async (req, res) => {
    try {
        let params = req.body;

        // Comprobar que los datos llegan correctamente
        if (!params.email || !params.password) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Buscar usuario
        const userLogin = await User.findOne({ email: params.email.toLowerCase() });

        // Si no existe el usuario
        if (!userLogin) {
            return res.status(400).json({
                status: "error",
                message: "El usuario no existe"
            });
        }

        // Comprobar que la contraseña sea correcta
        const pwd = bcrypt.compareSync(params.password, userLogin.password);

        if (!pwd) {
            return res.status(400).json({
                status: "error",
                message: "La contraseña es incorrecta"
            });
        }

        // Conseguir token  
        const token = jwt.createToken(userLogin);

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Usuario logueado correctamente",
            token,
            user: {
                id: userLogin._id,
                name: userLogin.name,
                email: userLogin.email
            }
        });


    } catch (error) {

    }
}

// Perfil de usuario
const profile = async (req, res) => {
    try {
        // Obtener datos del usuario
        const user = await User.findById(req.params.id);

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Usuario obtenido correctamente",
            user
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener usuario"
        });
    }
}

// Editar usuario
const update = async (req, res) => {
    try {

        // Usuario a editar
        const userIdentity = req.user;
        const userToUpdate = req.body;

        // Validar los datos (password es opcional en update)
        if (!userToUpdate.name || !userToUpdate.email) {
            return res.status(400).json({
                status: "error",
                message: "Nombre y email son obligatorios"
            });
        }

        // Control de usuarios duplicados
        const users = await User.find({
            $or: [
                { email: userToUpdate.email.toLowerCase() }
            ]
        });

        let userIsset = false;
        users.forEach(user => {
            if (userToUpdate && user.id != userIdentity.id) {
                userIsset = true;
            }

        });

        if (userIsset) {
            return res.status(200).json({
                status: "error",
                message: "El usuario ya existe"
            });
        }
        // Ciframos de nuevo la contraseña
        if (userToUpdate.password) {
            const pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;
        } else {
            delete userToUpdate.password;
        }

        // Actulizar usuario
        try {
            const userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });
            return res.status(200).json({
                status: "success",
                message: "Usuario actualizado correctamente",
                user: {
                    id: userUpdated._id,
                    name: userUpdated.name,
                    email: userUpdated.email
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar usuario"
            });
        }



    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al editar usuario"
        });
    }
}


// Exportar las funciones
module.exports = {
    register,
    login,
    update
};