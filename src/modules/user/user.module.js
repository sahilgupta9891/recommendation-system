const mongoose= require('mongoose');
const userFeild={
    name:{ type:String , require:true },
    address:{ type:String , require:true },
    email:{ type:String , require:true , unique:true },
    phone:{type:Number , require:true, unique:true },
    role:{ type:String , require:true, default:'user' },
    isactive:{ type:Boolean , default:true },

}
const userSchema= new mongoose.Schema(userFeild,{
    timestamps:true
})
const userModel= mongoose.model('User', userSchema);
module.exports = userModel