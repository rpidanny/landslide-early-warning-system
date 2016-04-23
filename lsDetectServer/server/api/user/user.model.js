var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true 
    },
    password: {
        type: String
    },
    phone: {
        type: String
    },
    location: {
        type: String
    },
    created_date:{
        type: Number
    }
});
module.exports = mongoose.model('User', userSchema);