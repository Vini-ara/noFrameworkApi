const { MongoClient, ServerApiVersion } = require('mongodb');

const url = process.env.MATO_SECO;

class DbConnection {
  constructor() {
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  }

  async getMatoSecoDb() {
    await this.client.connect()

    return this.client.db("MatoSeco")
  }
}

module.exports = DbConnection;

