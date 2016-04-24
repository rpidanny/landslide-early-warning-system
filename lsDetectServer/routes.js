module.exports = function(app, io) {
    app.use('/user', require('./server/api/user'));
    app.use('/sensor', require('./server/api/sensor')(io));
    app.get('*', function(req, res) {
        res.render("index");
    });
    
}