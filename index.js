const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// A porta será configurada pelo Railway ou será 3000 localmente
const PORT = process.env.PORT || 3000;

// API para buscar todos os jogos de uma lista (essa parte precisa de uma fonte de dados real, como uma API ou banco de dados)
const getSteamGames = async () => {
  try {
    // Exemplo fictício de uma API que retorna jogos
    const response = await axios.get("https://api.steampowered.com/ISteamApps/GetAppList/v2");
    return response.data.applist.apps; // Supondo que 'apps' seja a lista de jogos
  } catch (error) {
    console.error("Erro ao buscar jogos da Steam:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};

// Rota de raiz para testar se a API está funcionando
app.get("/", (req, res) => {
  res.send("API está funcionando! Acesse /games para ver os jogos.");
});

// Rota para buscar todos os jogos
app.get("/games", async (req, res) => {
  const games = await getSteamGames();
  res.json(games);
});

// Rota para buscar um jogo específico, com a modificação para usar "_" em vez de espaços
app.get("/games/:name", async (req, res) => {
  const gameName = req.params.name.replace(/_/g, " "); // Substitui underscores por espaços
  const games = await getSteamGames();
  const game = games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

  if (game) res.json(game);
  else res.status(404).json({ error: "Jogo não encontrado" });
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
