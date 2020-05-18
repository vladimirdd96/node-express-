const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product page",
    path: "/admin/add-product",
    editing: false
  });
};

const postAddProduct = (req, res, next) => {
  const product = new Product(
    null,
    req.body.title,
    req.body.imageUrl,
    req.body.price,
    req.body.description
  );
  product.save();
  res.redirect("/admin/products");
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;
  if (!editMode) {
    return res.redirect("/");
  }
  Product.findById(productId, product => {
    res.render("admin/edit-product", {
      pageTitle: "Edit product page",
      path: "/admin/edit-product",
      editing: editMode,
      product: product
    });
  });
};
const postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  console.log(productId);
  const updatedTitle = req.body.title;
  const updatedImage = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    productId,
    updatedTitle,
    updatedImage,
    updatedPrice,
    updatedDesc
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};
const getProducts = (req, res, next) => {
  Product.fetchAll(data => {
    res.render("admin/products", {
      products: data,
      pageTitle: "Admin products",
      path: "/admin/products",
      hasProducts: data.length > 0
    });
  });
};
const deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.delete(productId);
  res.redirect("/admin/products");
};
module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct
};
