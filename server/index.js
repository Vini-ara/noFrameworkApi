const http = require("http")
const { join, extname } = require("path")
const fs = require("fs")

const ContentTypes = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.JPG': 'image/jpeg',
    '.svg': 'image/svg+xml'
}

const rootDir = join(__dirname, '../');
const publicDir = join(rootDir, '/public');

function createStream(filename) {
    return fs.createReadStream(filename)
}

const routes = async (req, res) => {
    const { url, method } = req;

    if(url === '/index.html' && method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        const stream = await createStream(join(publicDir, 'index.html'))

        return stream.pipe(res)
    }

    if(method === 'GET') {
        console.log(join(publicDir, url))

        if(extname(join(publicDir, url)).length !== 0) {
            res.writeHead(200, {
                'Content-Type': ContentTypes[extname(join(publicDir, url))]
            })

            const stream = await createStream(join(publicDir, url))

            return stream.pipe(res)
        } 

        res.writeHead(404)

        return res.end()
    }
}

const handleRoutes = (req, res) => {
    return routes(req, res).catch(error => handleError(error, res))
}

const handleError = (error, res) => {
    if(error.message.includes('ENOENT')) {
        res.writeHead(404) 

        return res.end()
    }

    res.writeHead(505) 

    return res.end()
}

const server = http.createServer(handleRoutes);

server.listen(8000)