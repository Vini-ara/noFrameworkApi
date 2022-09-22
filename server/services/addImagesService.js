const fs = require('fs')
const DbConnection = require('../database/index');

class AddImagesService {
  async execute(req, res) {
    let chunks = [];

    async function onEnd() {
      let data = JSON.parse(Buffer.concat(chunks))
      await this.postData(data); 
    }

    req.on('data', chunk => chunks.push(chunk))

    req.on('end', onEnd.bind(this));
  }

  async postData(data) {
    const db = new DbConnection();

    const matoseco = await db.getMatoSecoDb();

    console.log(data)

    await matoseco.collection("images").insertMany(data);
    
    await db.client.close();
  }
} 

module.exports = AddImagesService;
