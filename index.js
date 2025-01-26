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

    // Log para depurar e verificar os jogos
    console.log("Jogos retornados: ", games);

    const gameList = games.map(game => ({
      id: game.id,
      name: game.title,  // Garantir que estamos acessando o título corretamente
      price: game.lastPrice ? game.lastPrice.amount : "Indisponível",
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

app.get("/games/:name", async (req, res) => {
  const gameName = req.params.name.replace(/_/g, " ").toLowerCase(); // Substitui "_" por espaços e normaliza para minúsculas
  const games = await getAllGames();

  console.log("Procurando jogo:", gameName);
  console.log("Lista de jogos: ", games.map(game => game.name)); // Exibe todos os nomes dos jogos

  // Busca o jogo
  const game = games.find(g => g.name.toLowerCase() === gameName);

  if (game) {
    res.json(game); // Retorna o jogo encontrado
  } else {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});


// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
