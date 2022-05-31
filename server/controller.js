const Service = require('./service.js');

class Controller {
	constructor() {
		this.service = new Service();
	}

	getFileStream(filename) {
		return this.service.getFileStream(filename);
	}
}

module.exports = Controller;
