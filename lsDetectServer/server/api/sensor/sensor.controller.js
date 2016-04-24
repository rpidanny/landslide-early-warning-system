'use strict';
var express = require('express');
var router = express.Router();
var mailConfig = require('../../config/mailConfig.json');
var Sensor = require('./sensor.model');
var User = require('../user/user.model');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var nodemailer = require('nodemailer');
var http = require('http');

exports.index = function(req, res) {
    console.log('hello Sensor');
};

exports.store = function(req, res) {
    console.log(req.body);
    req.body.created_date = Date.now();
    if((req.body.pan < -18 || req.body.pan > 18) && req.body.humidity > 80) {
        console.log('compare and send data');
        compareSensorData(req.body, function(response){
            if(response.success == false){
                res.status(400);
                return res.send(response);
            }
            // console.log(response);
        });
    }
    storeSensorData(req.body, function(response){
        if(response.success == false){
            res.status(400);
            return res.send(response);
        }
        return res.send(response);
    });
};

function storeSensorData(sensorObject, cb) {
    Sensor.create(sensorObject, function(err, sensor) {
        if (err) {
            console.log(err);
            return cb({
                success: false,
                message: 'Error storing sensor data.'
            });
        } else {
            return cb({
                success: true,
                message: 'Sensor Data stored successfully.'
            });
        }
    });
}

function compareSensorData(sensorObject, cb) {
    if(sensorObject.location == 0) {
        if(sensorObject.sensor_id == 0) {
            var findSensorId = 1
        }else {
            var findSensorId = 0;
        }
    }else {
        if(sensorObject.location == 1) {
            if(sensorObject.sensor_id == 2) {
                var findSensorId = 3
            }else {
                var findSensorId = 2;
            }
        }
    }
    Sensor.findOne({
        $and: [{
            location: sensorObject.location,
            sensor_id: findSensorId
        }]
    }).sort({_id:-1}).exec(function(err, sensorData){
        if (err) {
            console.log(err);
            return cb({
                success: false,
                message: 'Error getting sensor data.',
                sensor_data: null
            });
        } else {
            console.log(sensorData);
            if(sensorData){
                if((parseInt(sensorData.pan) < -18 || parseInt(sensorData.pan) > 18) && sensorData.humidity > 80) {
                    sendEmail(sensorData.location);
                    sendNotification(sensorData.location);
                }
            }
        }
    });
}

function updateUserPushFlag(location){
    User.update({
        location: location.toString()
    },{
        $set:{
            push_notified: true
        }
    },{multi: true}, function(err, updateRes){
        if(err){
            console.log(err);
        }else{
            console.log(updateRes);
        }
    })
}

function sendNotification(location) {
    console.log('send notification');
    User.find({location: location.toString()}).sort({created_date: 1}).limit(1).exec(function(err, userRes){
        if (err) {
            console.log(err);
        }
        else{
            if (userRes[0].push_notified == false) {   
                updateUserPushFlag(location);
                if(location == 0){
                    var loc = 'Thapathali'
                }else{
                    if(location == 1){
                        var loc = 'Jawalakhel'
                    }else{
                        var loc = 'Gwarko'
                    }
                }
                var postData = JSON.stringify({
                    "data": { 
                        "message": "Run for your Life", "title":"Landslide Alert"
                    },
                    "to" : "/topics/"+ loc
                });
                var options = {
                    hostname: 'gcm-http.googleapis.com',
                    path: '/gcm/send',
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization' : 'key=AIzaSyDP4KfNaMQz3pHkm11352XbvrtD-7ZLOyw'
                    }
                };

                var req = http.request(options, function(res) {
                    console.log('Status: ' + res.statusCode);
                    console.log('Headers: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', function (body) {
                        console.log('Body: ' + body);
                    });
                });
                req.on('error', function(e) {
                    console.log('problem with request: ' + e.message);
                });
                // write data to request body
                req.write(postData);
                req.end();
            }
        }
    })
}


function sendEmail(location, cb) {
    console.log('send mail');
    User.find({
        $and:[{
            location: location,
            email_notified: false
        }]
    }, function(err, userRes){
        if (err) {
            console.log(err);
            return cb({
                success: false,
                message: 'Error while getting user data',
                user_data: null
            });
        }
        userRes.forEach(function(item, index){
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'Gmail',
                auth: {
                    user: mailConfig.email,
                    pass: mailConfig.password
                }
            });
            var mailOptions = {
                to: item.email,
                subject: 'Landslide Alert',
                text: 'You are receiving this because your area is under danger of having a landslide\n\n' +
                    'Please take safety precautions accordingly.\n\n' 
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log(err, 'done');
                User.update({
                    email: item.email
                },{
                    $set:{
                        email_notified: true
                    }
                }, function(err, updateRes){
                    if(err){
                        console.log(err)
                    }else{
                        console.log(updateRes);
                    }
                });
            });
        })
    });
}