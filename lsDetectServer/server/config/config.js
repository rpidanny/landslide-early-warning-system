var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
	development: {
		rootPath: rootPath,
		db: 'mongodb://192.168.1.35/lsDetector',
		port: process.env.PORT || 3000
	},
	production: {
		rootPath: rootPath,
		db: 'mongodb://ujwalbaiar:<dbpassword>@ds031903.mongolab.com:31903/userapi',
		port: process.env.PORT || 80
	}
}