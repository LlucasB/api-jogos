const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Exemplo de uma função que pegaria os jogos com preços
const getGamesWithPrice = async () => {
  try {
    const response = await axios.get("https://api.exemplo.com/games"); // Exemplo de API de jogos
    return response.data.games; // Retorna os dados dos jogos com preço
  } catch (error) {
    console.error("Erro ao buscar dados dos jogos:", error);
    return []; // Retorna array vazio se erro
  }
};

// Rota para buscar todos os jogos com preços
app.get("/games", async (req, res) => {
  const games = await getGamesWithPrice();
  res.json(games);
});

// Rota para buscar um jogo específico com preço
app.get("/games/:name", async (req, res) => {
  const gameName = req.params.name.replace(/_/g, " "); // Substitui "_" por espaços
  const games = await getGamesWithPrice();
  const game = games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

  if (game) res.json(game);
  else res.status(404).json({ error: "Jogo não encontrado" });
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Exemplo de uma função que pegaria os jogos com preços
const getGamesWithPrice = async () => {
  try {
    const response = await axios.get("https://api.exemplo.com/games"); // Exemplo de API de jogos
    return response.data.games; // Retorna os dados dos jogos com preço
  } catch (error) {
    console.error("Erro ao buscar dados dos jogos:", error);
    return []; // Retorna array vazio se erro
  }
};

// Rota para buscar todos os jogos com preços
app.get("/games", async (req, res) => {
  const games = await getGamesWithPrice();
  res.json(games);
});

// Rota para buscar um jogo específico com preço
app.get("/games/:name", async (req, res) => {
  const gameName = req.params.name.replace(/_/g, " "); // Substitui "_" por espaços
  const games = await getGamesWithPrice();
  const game = games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

  if (game) res.json(game);
  else res.status(404).json({ error: "Jogo não encontrado" });
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
