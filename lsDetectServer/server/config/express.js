var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

module.exports = function(app, config){
	app.use(bodyParser());
	app.use(session({
		secret: 'l5d3t3ct'
	}));
	/*static path*/
	app.use(express.static(config.rootPath + '/public'));
	app.set('views', config.rootPath + '/server/views');
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
}
