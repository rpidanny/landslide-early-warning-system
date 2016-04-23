var mongoose = require('mongoose');

var sensorSchema = mongoose.Schema({
    tilt_angle: {
        type: String
    },
    x_acceleration: {
        type: String
    },
    y_acceleration: {
        type: String
    },
    z_acceleration: {
        type: String
    },
    created_date:{
        type: Number
    }
});
module.exports = mongoose.model('Sensor', sensorSchema);