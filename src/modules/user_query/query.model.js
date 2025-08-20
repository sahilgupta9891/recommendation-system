const {mongoose} = require('mongoose');
const userQueryFeild={
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    query: { type: String, required: true },
}
const userQuerySchema= new mongoose.Schema(userQueryFeild, {
    timestamps: true,   })
const userQueryModel = mongoose.model('UserQuery', userQuerySchema);
model.exports = userQueryModel;
