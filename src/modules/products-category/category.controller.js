const categoryModel = require('./category.model');
class category {
    async getAllCategories(req, res) {
        try {
            const categories = await categoryModel.find({ isactive: true });
            if (categories.length === 0) {  
                return res.status(404).json({ message: "No categories found" });
            }
            return res.status(200).json({ message: "Categories retrieved successfully", categories });
        } catch (error) {
            console.error(`Error retrieving categories: ${error.message}`); 
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async getCategoryById(req, res) {
        try {
            const categoryId = req.params.id;
            if (!categoryId) {
                return res.status(400).json({ message: "Category ID is required" });
            }
            const category = await categoryModel.findById(categoryId);
            if (!category || !category.isactive) {
                return res.status(404).json({ message: "Category not found" });
            }
            return res.status(200).json({ message: "Category retrieved successfully", category });
        } catch (error) {
            console.error(`Error retrieving category: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    }   
    async createCategory(req, res) {
        try {
            const { name, id } = req.body;
            if (!name || !id) {
                return res.status(400).json({ message: "Name and description are required" });
            }
            const userRole = req.user.role;
            if (userRole !== 'admin') {
                return res.status(403).json({ message: "Access denied" });
            }
            const isCategoryExists = await categoryModel.findbyId({id});
            if (isCategoryExists) {
                return res.status(400).json({ message: "Category with this ID already exists" });
            }
            const category = await categoryModel.create({ name, id });
            return res.status(201).json({ message: "Category created successfully", category });
        } catch (error) {
            console.error(`Error creating category: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateCategory(req, res) {
        try {
            const categoryId = req.params.id;
            if (!categoryId) {
                return res.status(400).json({ message: "Category ID is required" });
            }
            const userRole = req.user.role;
            if (userRole !== 'admin') {
                return res.status(403).json({ message: "Access denied" });
            }
            const category = await categoryModel.findByIdAndUpdate(categoryId, req.body, { new: true });
            if (!category || !category.isactive) {
                return res.status(404).json({ message: "Category not found" });
            }
            return res.status(200).json({ message: "Category updated successfully", category });
        } catch (error) {
            console.error(`Error updating category: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteCategory(req, res) {
        try {
            const categoryId = req.params.id;
            if (!categoryId) {
                return res.status(400).json({ message: "Category ID is required" });
            }
            const userRole = req.user.role;
            if (userRole !== 'admin') {
                return res.status(403).json({ message: "Access denied" });
            }
            const category = await categoryModel.findById(categoryId);
            if (!category || !category.isactive) {
                return res.status(404).json({ message: "Category not found" });
            }
            category.isactive = false;
            await category.save();
            return res.status(200).json({ message: "Category deleted successfully" });
        } catch (error){
            console.error(`Error deleting category: ${error.message}`);
            return res.status(500).json({ message: "Internal server error" });
        }
}
}
module.exports = new category();