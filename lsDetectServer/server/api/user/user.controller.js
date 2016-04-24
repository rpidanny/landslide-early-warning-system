'use strict';
var express = require('express');
var router = express.Router();
var User = require('./user.model');
var mongoose = require('mongoose');
var crypto = require('crypto');
var secret = 'l5d3t3ct';

exports.index = function(req, res) {
    console.log('hello User')
};

exports.register = function(req, res) {
	var userObject = {
		name: req.body.user.name,
		email: req.body.user.email,
        password: crypto.createHmac('sha256', secret).update(req.body.user.password).digest('hex'),
		phone: req.body.user.phone,
		location: req.body.user.location,
        created_date: Date.now()
	}
	User.create(userObject, function(err, user) {
        if (err) {
            console.log(err);
            return res.send({
            	success: false,
            	message: 'Error registering user.'
            });
        } else {
            return res.send({
            	success: true,
            	message: 'User registered successfully',
            	user_data: user
            });
        }
    });
};

exports.login = function(req, res) {
    var password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
    User.find({email:req.body.email}).sort({_id:-1}).limit(1).exec(function(err, result){
        if (result.length != 0) {
            if(password === result[0].password){
                req.session.name = result[0].name;
                req.session.email = result[0].email;
                req.session.location = result[0].location;
                req.session.phone = result[0].phone;
                res.send(result);
            }
            else {
                res.send(400);
                return res.send({
                    success: false,
                    message: 'Authetication Error'
                });
            }
        }
        else{
            res.send(400);
            return res.send({
                success: false,
                message: 'Authetication Error'
            });
        }
    });
}