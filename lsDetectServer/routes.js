module.exports = function(app) {
    app.use('/user', require('./server/api/user'));
    
    app.get('*', function(req, res){
    	res.render("index");
    });
}

