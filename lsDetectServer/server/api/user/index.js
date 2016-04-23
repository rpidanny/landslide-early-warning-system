var express = require('express');
var controller = require('./user.controller');
var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.register);

module.exports = router;