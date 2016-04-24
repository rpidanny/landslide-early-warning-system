var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
	development: {
		rootPath: rootPath,
		db: 'mongodb://192.168.1.35/lsDetector',
		port: process.env.PORT || 3000
	}
}