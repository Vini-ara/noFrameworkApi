const DbConnection = require('../database/index');

class GetAllImagesService {
  async execute() {
    const db = new DbConnection();

    const matoseco = await db.getMatoSecoDb()

    const images = matoseco.collection("images").find({}).toArray();

    await db.client.close();

    return images;
  }
} 

module.exports = GetAllImagesService;
