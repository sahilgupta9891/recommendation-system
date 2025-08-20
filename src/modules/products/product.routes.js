const express = require('express');
const productController = require('./product.controller');
const router = express.Router();

router.post('/', productController.createProduct);
router.get('/:id', productController.getoneProduct);
router.get('/:name', productController.getAllProducts);
router.get('/:category', productController.getProductsByCategory);
router.get('/:manufacture', productController.getProductsByManufacture);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
module.exports = router;