const { Schema, model } = require('mongoose');

const workSessionSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    categoryId: {
        type: Schema.ObjectId,
        ref: "Category"
    },
    description: String,
    checkIn: Date,
    checkOut: Date,

});

module.exports = model("WorkSession", workSessionSchema);
