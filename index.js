const express = require("express");
let ejs = require("ejs");
const bodyParses = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/pergunta");
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados!");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

const app = express();

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
  res.render("perguntar");
});

app.get("/pergunta/:id", (req, res) => {
  let id = req.params.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((element) => {
    if (element != undefined) {
      res.render("pergunta", {
        pergunta: element,
      });
    } else {
      res.redirect("/");
    }
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

app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});
