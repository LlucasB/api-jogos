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
      const priceOverview = gameData.price_overview;
      let price = {};

      if (priceOverview) {
        const currency = priceOverview.currency;
        if (currency === "BRL") {
          price = {
            initial: (priceOverview.initial / 100).toFixed(2), // Já em reais
            final: (priceOverview.final / 100).toFixed(2),
            discount: priceOverview.discount_percent || 0
          };
        } else {
          // Se a moeda não for BRL, você pode converter
          const conversionRate = await getConversionRate(); // Função de conversão como mostrado antes
          price = {
            initial: (priceOverview.initial / 100 * conversionRate).toFixed(2),
            final: (priceOverview.final / 100 * conversionRate).toFixed(2),
            discount: priceOverview.discount_percent || 0
          };
        }
      } else {
        price = 'Free-to-play'; // Caso o jogo seja gratuito
      }

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

// Função para pegar a taxa de conversão de USD para BRL
const getConversionRate = async () => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/SUA_CHAVE_API/latest/USD`);
    return response.data.conversion_rates.BRL; // A taxa de conversão para BRL
  } catch (error) {
    console.error("Erro ao obter a taxa de conversão:", error);
    return 1; // Retorna 1 se houver um erro na API (não faz conversão)
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
