const pageNotFound = (req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found ejs", path: "" });
};


module.exports = {
    pageNotFound
};