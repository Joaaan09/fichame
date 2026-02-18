const { Schema, model } = require('mongoose');

const workSessionSchema = new Schema({
    userId: ObjectId,
    categoryId: ObjectId,
    description: String,
    checkIn: Date,
    checkOut: Date,

});

module.exports = model("WorkSession", workSessionSchema);
