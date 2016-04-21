'use strict';

var fs = require('fs');
var flags = require('./flags');

module.exports = {
	deleteIfExists: function (path) {
		if (fs.existsSync(path)) {
			fs.unlinkSync(path);
		}
	}
};
