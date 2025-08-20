const mongoose = require('mongoose');
// const { is } = require('type-is');
const { object } = require('webidl-conversions');
const categoryModel = require('../products-category/category.model');
const manufactureModel = require('../manufacture/manufacture.module');
const productField = {
    name: {type: String , required: true},
    code: {type:String, required: true, unique: true},
    manufacture_date:{type:Date, required: true},
    expiry_date:{type:Date, required: true},
    indigrents: {type: Array, required: true},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true},
    nutrients: {type: Array, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref:categoryModel, required: true},
    description: {type: Array, required: true},
    manufacture:{type:mongoose.Schema.Types.ObjectId, ref:manufactureModel, required:true},
    isactive: {type: Boolean, default: true}
}
const productSchema= new mongoose.Schema(productField,{
    timestamps: true
})
const productModel= mongoose.model('Product', productSchema);
module.exports = productModel;