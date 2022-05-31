const { publicDir, ContentTypes } = require('./config.js');
const  Controller = require('./controller.js');

const controller = new Controller();

async function routes(req, res)  {
    const { url, method } = req;

    if(url === '/' && method === 'GET') {
	res.writeHead(302, {
	    'Location': '/home'
	})

	return res.end();
    }

    if(url === '/home' && method === 'GET') {
	const { stream } = await controller.getFileStream('/index.html');

	return stream.pipe(res);
    }

    if(method === 'GET') {
	    const { stream, type } = await controller.getFileStream(url);

	    res.writeHead(200, {
		'Content-Type': ContentTypes[type],
	    });


	    return stream.pipe(res);
    } 

    res.writeHead(404)

    return res.end()
}



function handleError(error, res) {
    if(error.message.includes('ENOENT')) {
	res.writeHead(404);

	return res.end();
    }

	console.log(error)
    res.writeHead(505);

    return res.end();
}

function handleRoutes(req, res) {
    return routes(req, res).catch(error => handleError(error, res));
}

module.exports =  handleRoutes;

