const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
    userId: ObjectId,
    name: String,
    color: String,

});

module.exports = model("Category", categorySchema);