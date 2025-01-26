const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Função para obter a lista de aplicativos da Steam
const getAppList = async () => {
  try {
    const url = 'http://api.steampowered.com/ISteamApps/GetAppList/v0001/';
    const response = await axios.get(url);
    return response.data.applist.apps;
  } catch (error) {
    console.error("Erro ao buscar lista de aplicativos:", error);
    return [];
  }
};

// Função para buscar os detalhes de um jogo específico
const getGameDetails = async (appId, countryCode = 'us') => {
  try {
    const url = `http://store.steampowered.com/api/appdetails?appids=${appId}&cc=${countryCode}`;
    const response = await axios.get(url);

    if (response.data[appId].success) {
      const gameData = response.data[appId].data;
      return {
        name: gameData.name,
        appid: appId,
        price: gameData.price_overview ? {
          initial: gameData.price_overview.initial / 100, // Convertido para unidades reais (cents -> dólares)
          final: gameData.price_overview.final / 100,
          discount: gameData.price_overview.discount_percent
        } : 'Free-to-play'
      };
    } else {
      return { error: 'Jogo não encontrado' };
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do jogo:", error);
    return { error: 'Erro ao obter informações do jogo' };
  }
};

// Rota para obter todos os jogos com preço
app.get("/games", async (req, res) => {
  const apps = await getAppList();
  const gameDetailsPromises = apps.map(app => getGameDetails(app.appid));
  const gameDetails = await Promise.all(gameDetailsPromises);
  res.json(gameDetails);
});

// Rota para buscar um jogo específico
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
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
