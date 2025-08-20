const { message } = require("statuses");
const userModel = require('./user.module');
class usercontroller {


    async createrUser(req, res){
        try{
            const {name, address, email, phone, role}=req.body;
            if(!name || !address || !email|| !phone){
                return res.status(400).json({message: "All fields are required"});
            }
            if(!role || !role.trim()){
                return res.status(400).json({message: "please provide a valid role"}); 
            }
            const isuserExists = await userModel.findOne({ email });
            if(isuserExists){
                return res.status(400).json({message: "User already exists"});
            }
            const user = await userModel.create({
                name,
                address,
                email,
                phone,
                role: role || 'user'
            });
            return res.status(201).json({message: "User created successfully", user});
        }
        catch(error){
            console.error(`Error creating user: ${error.message}`);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    async updateUser(req, res){
        try{
            const userId = req.params.id;
            const user_role = req.user.role;
            if(!userId){
                return res.status(400).json({message: "User ID is required"});
            }
            const isuserExists = await userModel.findById(userId);
            if(!isuserExists || !isuserExists.isactive){ 
                return res.status(404).json({message: "User not found"});
            }
            if(user_role !== 'admin' || userId != req.user.id){
                return res.status(403).json({message: "Access denied"});
            }
            const user = await userModel.update({ _id: userId }, req.body, { new: true });
            
            return res.status(200).json({message: "User updated successfully", user});
        }
        catch(error){
            console.error(`Error updating user: ${error.message}`);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    async deleteUser(req, res){
        try{
            const admin_role= req.user.role;
            if(admin_role !== 'admin'){
                return res.status(403).json({message: "Access denied"});
            }
            const userId = req.params.id;
            const isuserExists = await userModel.findById(userId);
            if(!isuserExists|| !userId || !isuserExists.isactive){
                return res.status(404).json({message: "User not found"});
            }
            isuserExists.isactive = false;
            await isuserExists.save();
            return res.status(200).json({message: "User deleted successfully"});
        }
        catch(error){
            console.error(`Error deleting user: ${error.message}`);
            return res.status(500).json({message: "Internal server error"});
        }
    }
}
module.exports = new usercontroller();