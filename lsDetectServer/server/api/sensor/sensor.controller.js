'use strict';
var express = require('express');
var router = express.Router();
var Sensor = require('./sensor.model');
var mongoose = require('mongoose');

exports.index = function(req, res) {
    console.log('hello Sensor');
};

exports.store = function(req, res) {
    console.log(req.body);
    req.body.created_date = Date.now();
    Sensor.create(req.body, function(err, sensor) {
        console.log(err);
        console.log(sensor);
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