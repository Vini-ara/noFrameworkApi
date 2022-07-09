const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;


async function getDbTable() {
  try {
    const client = new MongoClient(url);

    await client.connect(); 

    console.log(client.db("matoseco").collection("images").find())

    return client.db("matoseco")
  } finally {
    await client.close();
  }
}

module.exports = getDbTable;

