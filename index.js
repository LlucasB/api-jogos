const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// Substitua com sua chave de API obtida no IsThereAnyDeal
const API_KEY = '1720f2e1097c7a061fa37f3b5f263564a8000bed';

const PORT = process.env.PORT || 3000;

// Função para buscar todos os jogos da IsThereAnyDeal
const getAllGames = async () => {
  try {
    const url = `https://api.isthereanydeal.com/v02/price/?key=${API_KEY}&plains=true`;
    const response = await axios.get(url);

    const games = response.data.data;

    // Processa os jogos e pega nome, preço e outras informações relevantes
    const gameList = games.map(game => ({
      id: game.id,
      name: game.title,
      currentPrice: game.lastPrice ? `${game.lastPrice.amount} ${game.lastPrice.currency}` : "Indisponível",
      historicalPrice: game.historyLow ? `${game.historyLow.amount} ${game.historyLow.currency}` : "Indisponível",
      url: `https://isthereanydeal.com/game/${game.slug}`
    }));

    return gameList;
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return [];
  }
};

// Rota de raiz para testar se a API está funcionando
app.get("/", (req, res) => {
  res.send("API está funcionando! Acesse /games para ver os jogos.");
});

// Rota para buscar todos os jogos
app.get("/games", async (req, res) => {
  const games = await getAllGames();
  if (games.length > 0) {
    res.json(games); // Retorna todos os jogos
  } else {
    res.status(500).json({ error: "Erro ao buscar jogos." });
  }
});

// Rota para buscar um jogo específico
app.get("/games/:name", async (req, res) => {
  const gameName = req.params.name.replace(/_/g, " "); // Substitui "_" por espaços
  const games = await getAllGames();

  // Busca o jogo, ignorando maiúsculas/minúsculas
  const game = games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

  if (game) {
    res.json(game); // Retorna o jogo encontrado
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
