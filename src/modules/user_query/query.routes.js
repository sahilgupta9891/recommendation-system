const express = require('express');
const {embeddingsForAllProducts} = require('./query.controller');
const router = express.Router();
router.post('/', embeddingsForAllProducts);
module.exports = router;