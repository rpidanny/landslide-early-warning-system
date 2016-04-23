var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(app, config){
	/*static path*/
	app.use(express.static(config.rootPath + '/public'));
	app.set('views', config.rootPath + '/server/views');
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
}
