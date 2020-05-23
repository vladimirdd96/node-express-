const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "stonnerexe95", {
  dialect: "mysql",
  host: "localhost"
});


module.exports = sequelize;