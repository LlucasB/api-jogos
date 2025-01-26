const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");  // Usado para fazer scraping de páginas HTML
require("dotenv").config(); // Para carregar variáveis de ambiente

const app = express();
app.use(cors());

// Porta do servidor (definida pelo Railway ou 3000 localmente)
const PORT = process.env.PORT || 3000;

// Função para buscar preço de um jogo na Steam
const getSteamPrice = async (gameId) => {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameId}`);
    const gameData = response.data[gameId];

    if (gameData.success && gameData.data.price_overview) {
      return {
        price: gameData.data.price_overview.final / 100, // Preço em centavos, por isso dividimos por 100
        currency: "BRL", // A Steam já retorna em BRL
        url: gameData.data.url,
      };
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Função para buscar preço de um jogo na Loja XYZ (exemplo fictício)
const getLojaXYZPrice = async (gameName) => {
  try {
    // Vamos buscar o preço na Loja XYZ via scraping, ou simular com um preço fixo
    const response = await axios.get(`https://www.loja-xyz.com.br/${gameName}`);
    const $ = cheerio.load(response.data); // Carregar HTML

    // Exemplo de scraping para pegar o preço
    const priceText = $("span.price").text().trim(); // Supondo que o preço está em um span com classe "price"
    const price = parseFloat(priceText.replace("R$", "").replace(",", ".").trim());

    return {
      price,
      currency: "BRL",
      url: `https://www.loja-xyz.com.br/${gameName}`,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Simulação de banco de dados para os jogos (por enquanto)
const games = [
  { id: 1, name: "Elden Ring", store: "Steam", storeId: 123456 }, // ID fictício da Steam
  { id: 2, name: "GTA V", store: "Loja XYZ" },
];

// Rota de raiz para testar se a API está funcionando
app.get("/", (req, res) => {
  res.send("API está funcionando! Acesse /games para ver os jogos.");
});

// Rota para buscar todos os jogos com os preços reais
app.get("/games", async (req, res) => {
  const gamePrices = [];

  for (const game of games) {
    let priceData;

    if (game.store === "Steam") {
      priceData = await getSteamPrice(game.storeId);
    } else if (game.store === "Loja XYZ") {
      priceData = await getLojaXYZPrice(game.name);
    }

    if (priceData) {
      gamePrices.push({
        name: game.name,
        store: game.store,
        price: priceData.price,
        currency: priceData.currency,
        url: priceData.url,
      });
    }
  }

  res.json(gamePrices);
});

// Rota para buscar um jogo específico
app.get("/games/:name", async (req, res) => {
  const game = games.find(g => g.name.toLowerCase() === req.params.name.toLowerCase());
  
  if (game) {
    let priceData;
    
    if (game.store === "Steam") {
      priceData = await getSteamPrice(game.storeId);
    } else if (game.store === "Loja XYZ") {
      priceData = await getLojaXYZPrice(game.name);
    }
    
    if (priceData) {
      res.json({
        name: game.name,
        store: game.store,
        price: priceData.price,
        currency: priceData.currency,
        url: priceData.url,
      });
    } else {
      res.status(404).json({ error: "Preço não encontrado" });
    }
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
