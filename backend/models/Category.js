const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    name: String,
    color: String,

});

module.exports = model("Category", categorySchema);