const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Função para buscar informações sobre um jogo específico na Steam
const getGameDetails = async (appId, countryCode = "us") => {
  try {
    const url = `http://store.steampowered.com/api/appdetails?appids=${appId}&cc=${countryCode}`;
    const response = await axios.get(url);

    if (response.data[appId] && response.data[appId].success) {
      const gameData = response.data[appId].data;
      const priceData = gameData.price_overview || {};
      
      return {
        name: gameData.name,
        price: priceData.final
          ? (priceData.final / 100).toFixed(2) // Converte de centavos para a moeda
          : "Grátis",
        discount: priceData.discount_percent || 0,
        currency: priceData.currency || "USD",
        url: `https://store.steampowered.com/app/${appId}`
      };
    } else {
      return { error: "Jogo não encontrado ou não disponível na sua região." };
    }
  } catch (error) {
    console.error("Erro ao buscar informações do jogo:", error);
    return { error: "Erro ao acessar a API da Steam." };
  }
};

// Rota para buscar informações de um jogo pelo ID
app.get("/game/:id", async (req, res) => {
  const appId = req.params.id;
  const countryCode = req.query.cc || "us"; // Padrão para US, mas pode ser alterado com parâmetro de consulta
  
  const gameDetails = await getGameDetails(appId, countryCode);
  
  if (gameDetails.error) {
    res.status(404).json({ error: gameDetails.error });
  } else {
    res.json(gameDetails);
  }
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
