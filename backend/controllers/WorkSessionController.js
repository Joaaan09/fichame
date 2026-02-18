// Importar dependencias
const WorkSession = require('../models/WorkSession.js');


// Empezar jornada
const start = async (req, res) => {
    try {


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al empezar jornada"
        });
    }
}

// Acabar jornada

// Crear jornada

// Editar jornada

// Listar jornadas

// Eliminar jornada

// Exportar funciones
module.exports = {
    start,
    end,
    create,
    list,
    remove
};

