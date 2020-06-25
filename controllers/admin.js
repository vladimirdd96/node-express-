const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
  // .populate('userId')
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => console.log("getProducts for admin error"));
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const newProduct = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user._id
  });
  newProduct
    .save()
    .then(result => {
      console.log("Created new product");
      res.redirect("/admin/products");
    })
    .catch(err => console.log("Error with adding new product to the Database"));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render("admin/edit-product", {
        product: product,
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode
      });
    })
    .catch(err => console.log("getEditProduct error"));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.findById(prodId)
    .then(product => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log("postEditProduct error"));
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(er => console.log(err));
};
