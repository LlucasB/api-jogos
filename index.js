const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Função para buscar o preço de um jogo diretamente na página da Steam
const getSteamGamePrice = async (appId) => {
  try {
    const url = `https://store.steampowered.com/app/${appId}`; // URL da Steam Store para o jogo
    const response = await axios.get(url); // Faz a requisição da página
    const $ = cheerio.load(response.data); // Carrega a resposta HTML com cheerio

    // Abaixo, pegamos o preço do jogo na página HTML
    const price = $(".game_purchase_price.price").text().trim(); // Extrai o preço
    return price || "Preço não encontrado"; // Retorna o preço, ou uma mensagem de erro
  } catch (error) {
    console.error("Erro ao buscar preço:", error);
    return "Erro ao buscar preço";
  }
};

// Rota para buscar todos os jogos com preço (aqui estamos usando o appId da Steam)
app.get("/games", async (req, res) => {
  const games = [
    { id: 1, name: "Elden Ring", appId: 1091500 },
    { id: 2, name: "GTA V", appId: 271590 }
  ];

  // Para cada jogo, buscamos o preço da Steam
  for (const game of games) {
    const price = await getSteamGamePrice(game.appId);
    game.price = price; // Adiciona o preço ao objeto do jogo
  }

  res.json(games); // Retorna a lista de jogos com preços
});

// Rota para buscar um jogo específico
app.get("/games/:name", async (req, res) => {
  const gameName = req.params.name.replace(/_/g, " "); // Substitui "_" por espaços
  const games = [
    { id: 1, name: "Elden Ring", appId: 1091500 },
    { id: 2, name: "GTA V", appId: 271590 }
  ];

  const game = games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

  if (game) {
    const price = await getSteamGamePrice(game.appId);
    game.price = price; // Adiciona o preço ao jogo
    res.json(game); // Retorna o jogo com preço
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
