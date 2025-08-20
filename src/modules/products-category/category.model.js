const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const categoryFields = {
    // _id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    isactive: { type: Boolean, default: true },
}
const categorySchema = new mongoose.Schema(categoryFields, {
    timestamps: true
});
const categoryModel = mongoose.model('Category', categorySchema);
module.exports = categoryModel;