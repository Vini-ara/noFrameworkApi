const { join } = require("path");

const rootDir = join(__dirname, '../');
const publicDir = join(rootDir, '/public');

const ContentTypes = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.JPG': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
}

module.exports = {
	ContentTypes,
	rootDir,
	publicDir
}
