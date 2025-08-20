const productModel = require('./product.module');
const categoryModel = require('../products-category/category.model');
const manufactureModel = require('../manufacture/manufacture.module');
class productController{
    async getoneProduct(req, res){
        try{
            const productId = req.params.id;
            if(!productId){
                return res.status(400).json({message: "Product ID is required"});
            }
            const product = await productModel.findById(productId);
            if(!product || !product.isactive){
                return res.status(404).json({message: "Product not found"});
            }
            return res.status(200).json({message: "Product retrieved successfully", product});
        }
        catch(error){
            console.error(`Error retrieving product: ${error.message}`);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    async getAllProducts(req, res){
        try{
            const product_name= req.query.name;
            const products= await productModel.aggregate([{
                $match:{
                    isactive: true,
                    $text:{
                        $search: product_name
                    }
                }
            }]);
            if(products.length === 0){
                return res.status(404).json({message: "No products found"});
            }
            return res.status(200).json({message: "Products retrieved successfully", products});
        }
        catch(error){
            console.error(`Error retrieving products: ${error.message}`);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    async getProductsByCategory(req, res){
        try{
            const category = req.params.category;
            const product= productModel.aggregate([
                {
                    $match : {
                        isactive: true,
                    }

                },
                {
                    $lookup:{
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryDetails'
                    },
                    
                    $match: {
                       ' categoryDetails.isactive': true,
                        'categoryDetails.name': category    
                }
            },
            {
                $project: {
                    name: 1,
                    code: 1,
                    manufacture_date: 1,
                    expiry_date: 1,
                    indigrents: 1,
                    quantity: 1,
                    price: 1,
                    nutrients: 1,
                    category: 1,
                    description: 1,
                    manufacture: 1, 

            }
        }
            ]) ;
            if(product.length()==0){
                return res.status(404).json({message: "No products found in this category"});
            }
            return res.status(200).json({message: "Products retrieved successfully", product});
        }
        catch(error){
            console.error(`Error retrieving products by category: ${error.message}`);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    async getProductsByManufacture(req, res){
        try{
            const manufacture = req.params.manufacture;
            const products = await productModel.aggregate([
                {
                    $match: {
                        isactive: true,
                 }
                },{
                    $lookup: {
                        from: 'manufactures',
                        localField: 'manufacture',
                        foreignField: '_id',
                        as: 'manufactureDetails'
                    }
                },
                {
                    $match: {
                        'manufactureDetails.isactive': true,
                        'manufactureDetails.name': manufacture
                    }
                },
                {
                    $project: {
                        name: 1,
                        code: 1,
                        manufacture_date: 1,
                        expiry_date: 1,
                        indigrents: 1,
                        quantity: 1,
                        price: 1,
                        nutrients: 1,
                        category: 1,
                        description: 1,
                        manufacture: 1
                    }
                }
            ])
            if(products.length === 0) {
                return res.status(404).json({message: "No products found for this manufacture"});
            }
            return res.status(200).json({message: "Products retrieved successfully", products});
        }
            catch(error) {
            console.error(`Error retrieving products by manufacture: ${error.message}`);
            return res.status(500).json({message: "Internal server error"});
            }
        }
    async createProduct(req, res) {
        try{
            const {name, code, manufacture_date, expiry_date, indigrents, quantity, price, nutrients, category, description, manufacture} = req.body;
            if(!name || !code || !manufacture_date || !expiry_date || !indigrents || !quantity || !price || !nutrients || !category || !description || !manufacture) {
                return res.status(400).json({message: "All fields are required"});
            }
            const isProductExists = await productModel.findOne({ code });
            if(isProductExists) {
                return res.status(400).json({message: "Product with this code already exists"});
            }
            const product = await productModel.create({
                name,
                code,
                manufacture_date,
                expiry_date,
                indigrents,
                quantity,
                price,
                nutrients,
                category,
                description,
                manufacture
            });
            return res.status(201).json({message: "Product created successfully", product});
        }
        catch(error) {
                console.error(`Error creating product: ${error.message}`);
                return res.status(500).json({message: "Internal server error"});
            }
  }
  async updateProduct(req, res) {
        try{
            const productId = req.params.id;
            if(!productId){
                return res.status(400).json({message: "Product ID is required"});
            }           
            const product = await productModel.findByIdAndUpdate(productId, req.body, {new: true});
            if(!product || !product.isactive) {
                return res.status(404).json({message: "Product not found"});
            }
            return res.status(200).json({message: "Product updated successfully", product});
        }
        catch(error) {
            console.error(`Error updating product: ${error.message}`);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    async deleteProduct(req, res) {
        try{
            const productId = req.params.id;
            if(!productId){
                return res.status(400).json({message: "Product ID is required"});
            }
            const userRole = req.user.role;
            if(userRole !== 'admin'){
                return res.status(403).json({message: "Access denied"});
            }
            const product = await productModel.findById(productId);
            if(!product || !product.isactive) {
                return res.status(404).json({message: "Product not found"});
            }
            product.isactive = false;
            await product.save();
            return res.status(200).json({message: "Product deleted successfully"});
        }
        catch(error) {
            console.error(`Error deleting product: ${error.message}`);
            return res.status(500).json({message: "Internal server error"});
        }
    }
}
module.exports = new productController();