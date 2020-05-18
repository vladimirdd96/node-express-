const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");
const p = path.join(rootDir, "data", "cart.json");
class Cart {
  static addProduct(id, productPrice) {
    //fetch previous cart
    fs.readFile(p, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(data);
      }
      // Analyze the cart => find existing products
      const existingProductIndex = cart.products.findIndex(el => el.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      //add new product / increse quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, data) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(data) };
      const product = updatedCart.products.find(el => el.id === id);
      updatedCart.products = updatedCart.products.filter(el => el.id !== id);
      updatedCart.totalPrice -= productPrice * product.qty;
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }
}

module.exports = Cart;
