const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;

class DbConnection {
  constructor() {
    this.client = new MongoClient(url);
  }

  async getMatoSecoDb() {
    await this.client.connect()
    return this.client.db("matoseco")
  }
}

module.exports = DbConnection;

