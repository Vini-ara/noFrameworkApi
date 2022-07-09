const fs = require('fs');
const getDbTable = require('../database/index');

class GetAllImagesService {
  async execute() {
    await getDbTable();
//    const db = await getDbTable();

//    const images = db.collection('images').find();


 //   return images;
  }
} 

module.exports = GetAllImagesService;
