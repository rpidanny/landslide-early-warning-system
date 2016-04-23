var express = require('express');
var stylus = require('stylus');
var logger = require('morgan');
var bodyParser = require('body-parser');

module.exports = function(app, config){
	function compile(str, path){
		return stylus(str).set('filename', path);
	}


	app.use(logger('dev'));
	app.use(bodyParser());

	app.use(stylus.middleware({
		src: config.rootPath  + '/public',
		compile: compile
	}));

	/*static path*/
	app.use(express.static(config.rootPath + '/public'));

	app.set('views', config.rootPath + '/server/views');
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
}
