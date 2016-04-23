var http = require('http');
var express = require('express');
var app = express();

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./server/config/config')[env];

require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./routes')(app);

app.set('port', process.env.PORT || 3000);
var ip = "localhost";
http.createServer(app).listen(config.port, ip);
console.log("Server Running at http://"+ip+":"+config.port);


