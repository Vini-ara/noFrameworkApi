const AddImagesService = require("../services/addImageService");

class AddImagesController {
  constructor() {
    this.service = new AddImagesService();
  }

  async execute(req, res) {
    await this.service.execute(req, res);  

    return; 
  }
}

module.exports = AddImagesController;
