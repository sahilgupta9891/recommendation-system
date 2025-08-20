const express = require('express');
const userController = require('./user.controller');
const router = express.Router();
router.post('/', userController.createrUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id', userController.updateUser);
module.exports = router;