const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://banea9:stonnerexe95@cluster0-wgehi.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then(client => {
      console.log("Connected");
      _db = client.db();
      callback();
    })
    .catch(err => console.log(err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found"
};
module.exports = { mongoConnect, getDb };
