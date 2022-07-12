const { publicDir, ContentTypes } = require('./config');

const GetAllImagesController = require('./controllers/getAllImagesController');
const  ViewController = require('./controllers/viewController');

const viewController = new ViewController();
const getAllImagesController = new GetAllImagesController();

async function routes(req, res)  {
  const { url, method } = req;

  if(url === '/' && method === 'GET') {
    res.writeHead(302, {
      'Location': '/home'
    })

    return res.end();
  }

  if(url === '/home' && method === 'GET') {
    const { stream } = await viewController.getFileStream('/index.html');

    return stream.pipe(res);
  }

  if(url === '/api/images' && method === 'GET') {
    const images = await getAllImagesController.execute(); 
  }
  
  if(url === '/api/images' && method === 'POST') {

  }

  if(method === 'GET') {
    const { stream, type } = await viewController.getFileStream(url);

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

  res.writeHead(505);

  return res.end();
}

function handleRoutes(req, res) {
  return routes(req, res).catch(error => handleError(error, res));
}

module.exports =  handleRoutes;

