const manufactureModel = require("./manufacture.module");

class manufactureController{
    async getManufactureById(req, res) {
        try {
            const { id }= req.params;
            const manufacture= await manufactureModel.findById(id);
            if (!manufacture || !manufacture.isactive) {
                return res.status(404).json({ message: 'Manufacture not found' });
            }
            return res.status(200).json({ message: 'Manufacture retrieved successfully', data: manufacture });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    async getAllManufactures(req, res) {
        try {
            const manufactures = await manufactureModel.find({ isactive: true });
            return res.status(200).json({ message: 'Manufactures retrieved successfully', data: manufactures });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    async createmanufacture(req, res) {
        try{
            const { name, id, address, contact, email}=req.body;
            if(!name || !id || !address || !contact || !email) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const manufacture=  await manufactureModel.findbyId(id);
            if(manufacture) {
                return res.status(400).json({ message: 'Manufacture already exists' });
            }
            const newManufacture = new manufactureModel({
                name,
                id,
                address,
                contact,
                email
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }

    }
    async updateManufacture(req, res) { 
        try{
            const { id } = req.params;
            const { name, address, contact, email } = req.body;
            if (!name || !address || !contact || !email) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const manufacture = await manufactureModel.findById(id);
            if (!manufacture || !manufacture.isactive) {
                return res.status(404).json({ message: 'Manufacture not found' });
            }
            if (manufacture.isactive === false) {
                return res.status(400).json({ message: 'Manufacture is inactive' });
            }

            manufacture.name = name;
            manufacture.address = address;
            manufacture.contact = contact;
            manufacture.email = email;
            await manufacture.save();
            return res.status(200).json({ message: 'Manufacture updated successfully', data: manufacture });
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    async deleteManufacture(req, res) {
        try {
            const { id } = req.params;
            const manufacture = await manufactureModel.findById(id);
            if (!manufacture || !manufacture.isactive) { 
                return res.status(404).json({ message: 'Manufacture not found' });
            }
            manufacture.isactive = false;
            await manufacture.save();
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

}
module.exports = new manufactureController();