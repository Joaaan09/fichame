const mongoose = require("mongoose");

// Conexión a la base de datos de Mongo
const connection = async () => {

    const mongoUrl = process.env.MONGODB_URI;

    try {
        await mongoose.connect(mongoUrl);
        console.log("Conexión a la base de datos exitosa");
    } catch (error) {
        console.log(error);
    }

}

module.exports = connection;