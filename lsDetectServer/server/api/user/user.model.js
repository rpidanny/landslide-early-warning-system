var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    phone: {
        type: String
    },
    location: {
        type: String
    }
});
module.exports = mongoose.model('User', userSchema);