const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? mongodb.ObjectID(id) : null;
    this.userId = userId
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log("Savedd");
      })
      .catch(err => console.log("Error in saving the file into the Database"));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err =>
        console.log("Error in fetching documents from the database")
      );
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: mongodb.ObjectID(id) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err =>
        console.log("Error in finding product by Id in the database")
      );
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: mongodb.ObjectID(id) })
      .then(product => {
        console.log("Deleted");
      })
      .catch(err =>
        console.log("Error in deleting the document from database")
      );
  }
}

module.exports = Product;
