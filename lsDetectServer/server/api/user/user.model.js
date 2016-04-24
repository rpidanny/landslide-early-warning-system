var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: Number
    },
    password:{
        type: String
    },
    location: {
        type: String
    },
    created_date: {
        type: Number
    },
    registeredFrom: {
        type: String,
        default: "web"
    },
    push_notified: {
        type: Boolean,
        default: false
    },
    email_notified: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('User', userSchema);