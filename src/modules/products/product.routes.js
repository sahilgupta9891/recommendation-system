const express = require('express');
const productController = require('./product.controller');
const router = express.Router();

router.post('/', productController.createProduct);
router.get('/:id', productController.getoneProduct);
router.get('/', productController.getAllProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/manufacture/:manufacture', productController.getProductsByManufacture);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
module.exports = router;