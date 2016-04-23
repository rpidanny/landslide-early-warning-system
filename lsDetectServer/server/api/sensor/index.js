var express = require('express');
var controller = require('./sensor.controller');
var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.store);

module.exports = router;