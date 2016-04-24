var mongoose = require('mongoose');

var sensorSchema = mongoose.Schema({
    tilt: {
        type: String
    },
    pan: {
        type: String
    },
    yaw: {
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
    location: {
        type: String
    },
    humidity: {
        type: String
    },
    sensor_id: {
        type: String
    },
    created_date: {
        type: Number
    }
});
module.exports = mongoose.model('Sensor', sensorSchema);