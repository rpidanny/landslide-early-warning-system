'use strict';
var express = require('express');
var router = express.Router();
var User = require('./user.model');
var mongoose = require('mongoose');

exports.index = function(req, res) {
    console.log('hello User')
};

exports.register = function(req, res) {
	var userObject = {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		location: req.body.location,
        created_date: Date.now()
	}
	User.create(userObject, function(err, user) {
        if (err) {
            console.log(err);
            res.send(400);
            return res.send({
            	success: false,
            	message: 'Error registering user.'
            });
        } else {
            return res.send({
            	success: true,
            	message: 'User registered successfully.',
            	user_data: user
            });
        }
    });
};