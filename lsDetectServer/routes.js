module.exports = function(app) {
    app.use('/user', require('./server/api/user'));
}

