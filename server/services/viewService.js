const fs = require('fs');
const fsPromises = require('fs/promises');
const { join, extname } = require('path');
const { createReadStream } = require('fs');

const { publicDir } = require('../config');

class Service {
	createStream(filename) {
	    return fs.createReadStream(filename)
	}

	async getFileInfo(file) {
		const fullFilePath = join(publicDir, file);

		await fsPromises.access(fullFilePath)
		const fileType = extname(file)

		return {
			type: fileType,
			name: fullFilePath
		}
	}

	async getFileStream(file) {
		const { type, name } = await this.getFileInfo(file)

		return {
			stream: this.createStream(name),
			type
		}
	}
}

module.exports = Service;
