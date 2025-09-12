const { ObjectId } = require('bson');
const e = require('express');
const mongoose = require('mongoose');
const manufacureFeild ={
    name: {type:String, required: true},
    // id: {type: String, required: true, unique: true},
    address: {type: String, required: true},
    contact: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    isactive: {type: Boolean, default: true}
}
const manufactureSchema= new mongoose.Schema(manufacureFeild, {
    timestamps: true
});
const manufactureModel = mongoose.model('Manufacture', manufactureSchema);  
module.exports = manufactureModel;