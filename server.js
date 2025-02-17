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

// 📌 Rota para listar mensagens (Nova Listagem)
app.get("/api/mensagens", (req, res) => {
  db.query("SELECT id, nome, email, mensagem, data_envio FROM mensagens", (err, results) => {
    if (err) {
      console.error("Erro ao buscar mensagens:", err);
      return res.status(500).json({ error: "Erro ao buscar mensagens" });
    }
    res.json(results);
  });
});

// 📌 Rota para adicionar uma nova mensagem
app.post("/api/mensagens", (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const query = "INSERT INTO mensagens (nome, email, mensagem, data_envio) VALUES (?, ?, ?, NOW())";
  db.query(query, [nome, email, mensagem], (err, result) => {
    if (err) {
      console.error("Erro ao salvar mensagem:", err);
      return res.status(500).json({ error: "Erro ao salvar a mensagem" });
    }
    res.status(201).json({ message: "Mensagem enviada com sucesso!" });
  });
});

// 📌 Rota para excluir mensagem
app.delete("/api/mensagens/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM mensagens WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Erro ao excluir mensagem:", err);
      return res.status(500).json({ error: "Erro ao excluir mensagem" });
    }
    res.json({ message: "Mensagem excluída com sucesso!" });
  });
});

// 📌 Rota para editar mensagem
app.put("/api/mensagens/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, mensagem } = req.body;

  db.query(
    "UPDATE mensagens SET nome = ?, email = ?, mensagem = ? WHERE id = ?",
    [nome, email, mensagem, id],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar mensagem:", err);
        return res.status(500).json({ error: "Erro ao atualizar mensagem" });
      }
      res.json({ message: "Mensagem atualizada com sucesso!" });
    }
  );
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
