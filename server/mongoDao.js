const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const database = "todos";
const col_name = "todos";

function bulkWrite(bulk, reject, resolve){
  MongoClient.connect(url, function(err, client) {
    const collection = client.db(database).collection(col_name);
    collection
      .bulkWrite(bulk)
      .catch(reject)
      .then(resolve)
      .then(() => {client.close();})
  });
}
/*bulkWrite([{"insertOne":{"document":{"_id":"1517926047258","content":"sdfs","state:":1}}},{"insertOne":{"document":{"_id":"1517926047999","content":"sfs","state:":1}}},{"insertOne":{"document":{"_id":"1517926047262","content":"df","state:":1}}},{"insertOne":{"document":{"_id":"1517926047264","content":"sf","state:":1}}},{"insertOne":{"document":{"_id":"1517926047266","content":"g","state:":1}}},{"insertOne":{"document":{"_id":"1517926047268","content":"g","state:":2}}}]
  ,(err) => {console.log(err);}
  ,(result) => {console.log(result)});*/

function findAll(callback){
  MongoClient.connect(url, function(err, client) {
    const collection = client.db(database).collection(col_name);
    collection.find({}).toArray(function(err, docs) {
      callback(docs);
      client.close();
    });
  });
}
//findAll((doc) => {console.log(doc)})

module.exports = {
  bulkWrite,
  findAll
}

