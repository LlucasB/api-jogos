const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// A chave da API (substitua com a sua chave, se necessário)
const GG_API_KEY = 'SUA_CHAVE_DE_API_AQUI'; // Pegue da GG.deals

// A porta será configurada pelo Railway ou será 3000 localmente
const PORT = process.env.PORT || 3000;

// Função para buscar os jogos e preços na API do GG.deals
const getAllGames = async () => {
  try {
    const url = `https://api.gg.deals/api/v1/games/?currency=BRL`; // URL da API para buscar jogos com preços em BRL
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${GG_API_KEY}`
      }
    });

    const games = response.data.data;

    // Processa os jogos, pegando nome, preço e outras informações relevantes
    const gameList = games.map(game => ({
      id: game.id,
      name: game.name,
      price: game.prices.final_price,  // Preço final em BRL
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

// Rota para buscar todos os jogos com preços em reais
app.get("/games", async (req, res) => {
  const games = await getAllGames();
  if (games.length > 0) {
    res.json(games); // Retorna todos os jogos com preços
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
    res.json(game); // Retorna o jogo com preço
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
