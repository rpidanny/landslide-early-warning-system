var express = require('express');
var controller = require('./user.controller');
var router = express.Router();

router.get('/', controller.index);
router.post('/login',controller.login);
router.post('/', controller.register);

module.exports = router;