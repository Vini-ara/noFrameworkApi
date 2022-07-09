const GetAllImagesService = require("../services/getAllImagesService");

class GetAllImagesController {
  constructor() {
    this.service = new GetAllImagesService();
  }

  async execute() {
    const images = await this.service.execute();  

    return images;
  }
}

module.exports = GetAllImagesController;
