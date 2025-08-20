const express = require('express');
const QueryResponseHandler = require('./query.controller');
const router = express.Router();
router.post('/', QueryResponseHandler.queryresponse);
module.exports = router;