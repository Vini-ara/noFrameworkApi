const fs = require('fs')
const DbConnection = require('../database/index');

class GetAllImagesService {
  async execute(req, res) {
    const db = new DbConnection();

    let chunks = [];
    let data;

    req.on('data', chunk => chunks.push(chunk))

    req.on('end', () => {
      data = JSON.parse(Buffer.concat(chunks))
    })

    const matoseco = await db.getMatoSecoDb()

    await db.client.close();
  }
} 

module.exports = GetAllImagesService;
