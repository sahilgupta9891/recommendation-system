const express = require('express');
const manufactureController = require('./manufacture.controller');
const router = express.Router();

router.post('/', manufactureController.createmanufacture);
router.get('/', manufactureController.getAllManufactures);
router.get('/:id', manufactureController.getManufactureById);
router.put('/:id', manufactureController.updateManufacture);
router.delete('/:id', manufactureController.deleteManufacture);
module.exports = router;