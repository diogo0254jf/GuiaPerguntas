const Sequelize = require("sequelize");
const connection = require("./database");
const Pergunta = require("./pergunta");

const resposta = connection.define("respostas", {
  idpergunta: {
    type: Sequelize.INTEGER,
    references: {
      model: Pergunta,
      key: "id",
    },
  },
  resposta: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

resposta.sync({ force: false }).then(() => {});

module.exports = resposta;
