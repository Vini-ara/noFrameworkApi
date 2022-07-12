const fs = require('fs');
const DbConnection = require('../database/index');

class GetAllImagesService {
  async execute() {
    const db = new DbConnection();

    const matoseco = await db.getMatoSecoDb()

    const images = matoseco.collection("images").find({ x : 1})

    console.log(await images.toArray())
    //await matoseco.collection("images").insertOne(
     // {bird: {name: "Tucano Toco", scientificName: "Ramphastos Toco"}, url: "http://seila.com", metadata: {}}
    //)
    await db.client.close();

//    const images = db.collection('images').find({});


 //   return images;
  }
} 

module.exports = GetAllImagesService;
