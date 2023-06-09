const express = require("express");
let ejs = require("ejs");
const bodyParses = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/pergunta");
const Resposta = require("./database/resposta");

const moment = require("moment");

connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados!");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

const app = express();

app.locals.formatarData = function (data) {
  return moment(data).format("DD/MM/YYYY HH:mm");
};

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParses.urlencoded({ extended: false }));
app.use(bodyParses.json());

app.get("/", (req, res) => {
  Pergunta.findAll().then((element) => {
    res.render("index", {
      perguntas: element,
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("RealizarPergunta/perguntar");
});

app.get("/pergunta/:id", (req, res) => {
  let id = req.params.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((element) => {
    Resposta.findAll({
      where: { idpergunta: element.id },
      order: [["id", "DESC"]],
    }).then((resposta) => {
      if (element != undefined && resposta != undefined) {
        res.render("Pergunta/pergunta", {
          pergunta: element,
          resposta: resposta,
        });
      } else {
        res.redirect("/");
      }
    });
  });
});

app.post("/salvarpergunta", (req, res) => {
  let titulo = req.body.Titulo;
  let descricao = req.body.Descricao;

  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect("/");
  });
});

app.post("/responderPergunta", (req, res) => {
  let id = req.body.id;
  let resposta = req.body.Resposta;
  Resposta.create({
    idpergunta: id,
    resposta: resposta,
  }).then(() => {
    res.redirect(`/pergunta/${id}`);
  });
});

app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});
