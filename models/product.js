const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");
const p = path.join(rootDir, "data", "products.json");
const Cart = require("./cart");
const getProductsFromFile = callback => {
  fs.readFile(p, (err, data) => {
    if (err) {
      return callback([]);
    }
    callback(JSON.parse(data));
  });
};

class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
  save() {
    getProductsFromFile(products => {
      if (this.id) {
        console.log("existing");
        const existingProductIndex = products.findIndex(
          el => el.id === this.id
        );
        console.log("this.id" + this.id);
        const updateProducts = [...products];
        updateProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updateProducts), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }
  static delete(id) {
    getProductsFromFile(products => {
      const product = products.find(el => el.id === id);
      const updatedProducts = products.filter(el => el.id !== id);

      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(el => el.id === id);
      callback(product);
    });
  }
}
module.exports = Product;
