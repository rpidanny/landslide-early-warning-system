var http = require('http');
var express = require('express');
var app = express();

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./server/config/config')[env];

require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);

app.set('port', process.env.PORT || 3000);
// var ip = "localhost";
var ip = "192.168.1.154";
var server = http.createServer(app)
server.listen(config.port, ip);

console.log("Server Running at http://" + ip + ":" + config.port);

//socket.io for streaming email messages
var io = require('socket.io')(server);
require('./routes')(app, io);

/*var netServer = require('net').Server();

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

*/

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var port = new SerialPort('COM4', {
    parser: serialport.parsers.readline('\n')
});
io.on('connection', function(socket) {
    port.on('data', function(data) {

        var splitData = data.split(',');
        var obj = {
            tilt: 0,
            pan: parseInt(splitData[2]),
            yaw: 0,
            x_acceleration: 0,
            y_acceleration: 0,
            z_acceleration: 0,
            location: parseInt(splitData[1]),
            humidity: parseInt(splitData[3]),
            sensor_id: parseInt(splitData[0])
        };


        var options = {
            hostname: '192.168.1.154',
            port: 3000,
            path: '/sensor',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        var x = http.request(options, function(res) {
            console.log("Connected");
            res.on('data', function(data) {
                socket.emit('sensor data', obj);
            });
        });
        x.write(JSON.stringify(obj));
        x.end();
    });
});