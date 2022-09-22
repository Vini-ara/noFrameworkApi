const AddImagesService = require("../services/addImagesService");

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
