const mongoose = require('mongoose');
const userQueryFeild={

    query: { type: String, required: true },
}
const userQuerySchema= new mongoose.Schema(userQueryFeild, {
    timestamps: true,   })
const userQueryModel = mongoose.model('UserQuery', userQuerySchema);
module.exports = userQueryModel;
