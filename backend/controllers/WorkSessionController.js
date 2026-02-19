// Importar dependencias
const WorkSession = require('../models/WorkSession.js');


// Empezar jornada
const start = async (req, res) => {
    try {
        // Obtener usuario
        const user = req.user;

        // Obtener categoria
        const category = req.body.categoryId;

        // Validar la categoria
        if (!category) {
            return res.status(500).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        };

        // Tiempo en el que se empieza la jornada
        const checkIn = Date.now();

        // Crear jornada
        const workSession = new WorkSession({
            user: user.id,
            categoryId: category,
            checkIn: checkIn
        });

        // Guardar jornada
        const workSessionStored = await workSession.save();

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Jornada empezada correctamente",
            workSession: workSessionStored
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al empezar jornada"
        });
    }
}

// Acabar jornada
const end = async (req, res) => {
    try {

        // Buscar jornada empezada por su Id y que sea del usuario
        const workSession = await WorkSession.findOne({
            _id: req.body.workSessionId,
            user: req.user.id
        });

        // Si no existe la jornada
        if (!workSession) {
            return res.status(404).json({
                status: "error",
                message: "No existe la jornada"
            });
        }

        // Tiempo en el que se acaba la jornada
        const checkOut = Date.now();

        // Actualizar jornada
        workSession.checkOut = checkOut;

        // Guardar jornada
        const workSessionStored = await workSession.save();

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Jornada acabada correctamente",
            workSession: workSessionStored
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al acabar jornada",
            error
        });
    }
}

// Crear jornada
const create = async (req, res) => {
    try {
        // Obtener datos del body
        const params = req.body;

        // Obtener usuario
        const user = req.user;

        // Validar datos (checkIn, checkOut y cateogry) 
        if (!params.checkIn || !params.checkOut || !params.categoryId) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Validar formato checkin y checkout
        if (params.checkIn >= params.checkOut) {
            return res.status(400).json({
                status: "error",
                message: "El checkin debe ser menor que el checkout"
            });
        }

        // Crear jornada
        const workSession = new WorkSession({
            user: user.id,
            categoryId: params.categoryId,
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            description: params.description
        });

        // Guardar jornada
        const workSessionStored = await workSession.save();

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Jornada creada correctamente",
            workSession: workSessionStored
        });


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al crear jornada"
        });
    }
}

// Editar jornada
const update = async (req, res) => {
    try {
        // Jornada a editar
        const workSessionId = req.params.id;
        const workSessionToUpdate = req.body;

        // Validar datos
        if (!workSessionToUpdate.checkIn || !workSessionToUpdate.checkOut || !workSessionToUpdate.categoryId) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Validar formato checkin y checkout
        if (workSessionToUpdate.checkIn >= workSessionToUpdate.checkOut) {
            return res.status(400).json({
                status: "error",
                message: "El checkin debe ser menor que el checkout"
            });
        }

        // Actualizar jornada
        const workSessionUpdated = await WorkSession.findByIdAndUpdate(workSessionId, workSessionToUpdate, { new: true });

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Jornada actualizada correctamente",
            workSession: workSessionUpdated
        });


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al editar jornada"
        });
    }
}

// Listar jornadas
const list = async (req, res) => {
    try {
        const workSessions = await WorkSession.find({
            user: req.user.id
        }).sort({ checkOut: -1 });
        return res.status(200).json({
            status: "success",
            message: "Jornadas obtenidas correctamente",
            workSessions
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener jornadas"
        });
    }
}

// Eliminar jornada
const remove = async (req, res) => {

    try {
        // Obtener id de la jornada
        const workSessionRM = req.params.id;

        // Buscar la jornada para borrar
        const workSession = await WorkSession.findById(workSessionRM);

        // Control de jornadas
        if (!workSession) {
            return res.status(404).json({
                status: "error",
                message: "Jornada no encontrada"
            });
        }

        // Control de que la categoria pertenezca al usuario
        if (workSession.user.toString() !== req.user.id) {
            return res.status(403).json({
                status: "error",
                message: "No tienes permiso para borrar esta jornada"
            });
        }

        // Borrar jornada
        const workSessionDeleted = await WorkSession.findByIdAndDelete(workSessionRM);

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Jornada eliminada correctamente",
            workSession: workSessionDeleted
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al borrar jornada",
            error
        });
    }
}


// Exportar funciones
module.exports = {
    start,
    end,
    create,
    update,
    list,
    remove
};

