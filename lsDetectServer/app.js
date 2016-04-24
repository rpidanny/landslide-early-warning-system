var http = require('http');
var express = require('express');
var app = express();
var net = require('net');


var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./server/config/config')[env];

require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./routes')(app);

app.set('port', process.env.PORT || 3000);
var ip = "localhost";
var server = http.createServer(app)
server.listen(config.port, ip);

console.log("Server Running at http://" + ip + ":" + config.port);
var socketPORT = 8000;
var netServer = require('net').Server();

netServer.listen(socketPORT, function() {
    console.log('Socket server running on PORT ' + socketPORT);
});

netServer.on('connection', function(socket) {
    console.log("new user");
    socket.on('data', function(userData){
    	var userObj = [userData, new Client(socket, userData)];
    	userList.push(userObj);
    });
});

var userList = [];

function Client(socket, userData, userList) {
    var address = socket.remoteAddr;
    var self = this;
    socket.on("end", function() {
    	console.log(self);
        // var index = userList.indexOf(self);
        // userList.splice(index, 1);
        console.log('disconnected');
    });

    this.getSocket = function() {
    	return [userData, socket];
        // return socket;
    };

}

