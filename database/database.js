const Sequelize = require("sequelize");

const connection = new Sequelize("guiaperguntas", "Diogo", "197946", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
