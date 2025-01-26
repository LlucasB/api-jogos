const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// A porta será configurada pelo Railway ou será 3000 localmente
const PORT = process.env.PORT || 3000;

// API para buscar todos os jogos da Steam (apenas IDs e nomes)
const getSteamGames = async () => {
  try {
    // API da Steam para pegar lista de jogos (ID e nome)
    const response = await axios.get("https://api.steampowered.com/ISteamApps/GetAppList/v2");
    return response.data.applist.apps; // Lista de jogos da Steam
  } catch (error) {
    console.error("Erro ao buscar jogos da Steam:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};

// Função para buscar detalhes do jogo incluindo preço
const getGameDetails = async (appId) => {
  try {
    const response = await axios.get(`http://store.steampowered.com/api/appdetails?appids=${appId}`);
    if (response.data[appId] && response.data[appId].success) {
      const gameData = response.data[appId].data;

      // Se o jogo não for gratuito, converte os preços de centavos para a moeda local (dólares)
      const price = gameData.price_overview ? {
        initial: (gameData.price_overview.initial / 100).toFixed(2), // Convertido para dólares com 2 casas decimais
        final: (gameData.price_overview.final / 100).toFixed(2),
        discount: gameData.price_overview.discount_percent || 0
      } : 'Free-to-play'; // Caso seja grátis

      return {
        name: gameData.name,
        appid: appId,
        price: price
      };
    } else {
      return { error: "Jogo não encontrado ou informações indisponíveis" };
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do jogo:", error);
    return { error: "Erro ao obter informações do jogo" };
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

// Rota para buscar detalhes de um jogo específico
app.get("/games/:id", async (req, res) => {
  const gameId = req.params.id;
  const gameDetails = await getGameDetails(gameId);

  if (gameDetails.error) {
    res.status(404).json(gameDetails);
  } else {
    res.json(gameDetails);
  }
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
