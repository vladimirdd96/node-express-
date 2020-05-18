const Product = require("../models/product");
const Cart = require("../models/cart");
const getProducts = (req, res, next) => {
  Product.fetchAll(data => {
    res.render("shop/product-list", {
      products: data,
      pageTitle: "All products",
      path: "/products",
      hasProducts: data.length > 0
    });
  });
};

const getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: `/products`
    });
  });
};

const getIndex = (req, res, next) => {
  Product.fetchAll(data => {
    res.render("shop/index", {
      products: data.slice(0, 3),
      pageTitle: "My Shop",
      path: "/index",
      hasProducts: data.length > 0
    });
  });
};

const getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart"
  });
};

const postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout"
  });
};

const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your orders",
    path: "/orders"
  });
};

module.exports = {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCart
};
