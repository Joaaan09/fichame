// Importar dependencias
const Category = require("../models/Category");


// Crear categoria
const create = async (req, res) => {
    try {

        // Obtener datos del body
        const params = req.body;

        // Validar los datos
        if (!params.name || !params.color) {
            return res.status(500).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Crear objeto cateogira
        let category_to_save = new Category(params);
        category_to_save.user = req.user.id;

        // Control de categorias duplicadas (solo del mismo usuario)
        const categories = await Category.find({
            name: category_to_save.name.toLowerCase(),
            user: req.user.id
        });

        if (categories.length >= 1) {
            return res.status(200).json({
                status: "error",
                message: "La categoria ya existe"
            });
        }

        // Guardar la categoria
        const categoryStored = await category_to_save.save();

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Categoria creada correctamente",
            category: {
                id: categoryStored._id,
                name: categoryStored.name,
                color: categoryStored.color
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al crear categoria"
        });
    }
}

// Listar categorias
const list = async (req, res) => {
    try {
        const categories = await Category.find({
            user: req.user.id
        }).sort({ name: 1 });
        return res.status(200).json({
            status: "success",
            message: "Categorias obtenidas correctamente",
            categories
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener categorias"
        });
    }
}

// Borrar categoria
const remove = async (req, res) => {

    try {
        // Obtener id de la categoria
        const categoryRM = req.params.id;

        // Buscar la categoria para borrar
        const category = await Category.findById(categoryRM);

        // Control de categorias
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Categoria no encontrada"
            });
        }

        // Control de que la categoria pertenezca al usuario
        if (category.user.toString() !== req.user.id) {
            return res.status(403).json({
                status: "error",
                message: "No tienes permiso para borrar esta categoria"
            });
        }

        // Borrar categoria
        const categoryDeleted = await Category.findByIdAndDelete(categoryRM);

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Categoria eliminada correctamente",
            category: categoryDeleted
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al borrar categoria",
            error
        });
    }





}


// Exportar las funciones
module.exports = {
    create,
    list,
    remove
};