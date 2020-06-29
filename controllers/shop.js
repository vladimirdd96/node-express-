const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        prods: products.slice(0, 3),
        pageTitle: "Shop",
        path: "/",
        isLoggedIn: req.session.isLoggedIn
      });
    })
    .catch(err => console.log("getIndex error"));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        isLoggedIn: req.session.isLoggedIn
      });
    })
    .catch(err => console.log("getProducts error"));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
      isLoggedIn: req.session.isLoggedIn
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      res.render("shop/cart", {
        products: user.cart.items,
        path: "/cart",
        pageTitle: "Your Cart",
        isLoggedIn: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(cart => {
      console.log(cart.cart.items);
      res.redirect("/cart");
    })
    .catch(err => console.log("postCartDeleteItem"));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(p => {
        return { quantity: p.quantity, product: { ...p.productId._doc } };
      });
      const order = new Order({
        products: products,
        user: { name: req.user.name, userId: req.user._id }
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => console.log("postOrder"));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render("shop/orders", {
        orders: orders,
        path: "/orders",
        pageTitle: "Your Orders",
        isLoggedIn: req.session.isLoggedIn
      });
    })
    .catch(err => console.log("getOrders error"));
};
