const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// A porta será configurada pelo Railway ou será 3000 localmente
const PORT = process.env.PORT || 3000;

// Função para buscar os jogos na Rawg API
const getAllGames = async () => {
  try {
    const url = 'https://api.rawg.io/api/games?key=YOUR_API_KEY';  // Aqui você pode usar a Rawg API
    const response = await axios.get(url);
    const games = response.data.results;

    // Processa os jogos, pegando nome, preço e outras informações relevantes
    const gameList = games.map(game => ({
      id: game.id,
      name: game.name,
      price: "Indisponível", // A Rawg API não fornece o preço diretamente
      url: game.url
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

// Rota para buscar todos os jogos com preços
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

  const game = games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

  if (game) {
    res.json(game); // Retorna o jogo
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
