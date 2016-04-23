'use strict';
var express = require('express');
var router = express.Router();
var Sensor = require('./sensor.model');
var mongoose = require('mongoose');

exports.index = function(req, res) {
    console.log('hello Sensor');
};

exports.store = function(req, res) {
    var sensorObject = {
        tilt_angle: req.body.tilt_angle,
        x_acceleration: req.body.x_acceleration,
        y_acceleration: req.body.y_acceleration,
        z_acceleration: req.body.z_acceleration,
        created_date: Date.now()
    }
    Sensor.create(sensorObject, function(err, sensor) {
        if (err) {
            console.log(err);
            res.status(400);
            return res.send({
                success: false,
                message: 'Error storing sensor data.'
            });
        } else {
            return res.send({
                success: true,
                message: 'Sensor Data stored successfully.'
            });
        }
    });
};