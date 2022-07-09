const Service = require('../services/viewService.js');

class ViewController {
	constructor() {
		this.service = new Service();
	}

	getFileStream(filename) {
		return this.service.getFileStream(filename);
	}
}

module.exports = ViewController;
