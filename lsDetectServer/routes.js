module.exports = function(app) {
    app.use('/user', require('./server/api/user'));
    app.use('/sensor', require('./server/api/sensor'));
    app.get('*', function(req, res){
    	res.render("index");
    });
}

