require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
});

// Rota para receber dados do formulário de contato
app.post("/api/contato", (req, res) => {
  const { nome, email, mensagem } = req.body;
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const query = "INSERT INTO mensagens (nome, email, mensagem) VALUES (?, ?, ?)";
  db.query(query, [nome, email, mensagem], (err, result) => {
    if (err) {
      console.error("Erro ao inserir dados:", err);
      return res.status(500).json({ error: "Erro ao salvar a mensagem" });
    }
    res.status(201).json({ message: "Mensagem enviada com sucesso!" });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
