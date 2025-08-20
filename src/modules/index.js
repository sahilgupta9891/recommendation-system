const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const products = require('./products');
const category= require('./products-category');
const manufacture = require('./manufacture');
const userQuery = require('./user_query');
router.use('/v1/user', userRoutes);
router.use('/v1/products', products);
router.use('./v1/category', category);
router.use('/v1/manufacture', manufacture);
router.use('/v1/query', userQuery);
module.exports = router; 
