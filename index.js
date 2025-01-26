const express = require("express"); // Declare express uma vez
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// A porta será configurada pelo Railway ou será 3000 localmente
const PORT = process.env.PORT || 3000;

// Simulação de banco de dados (por enquanto) com mais 5 jogos e 3 lojas diferentes
const games = [
    { id: 1, name: "Elden Ring", store: "Nuuvem", price: 199.90, url: "https://www.nuuvem.com/elden-ring" },
    { id: 2, name: "GTA V", store: "Steam", price: 75.00, url: "https://store.steampowered.com/app/271590" },
    { id: 3, name: "The Witcher 3", store: "Epic Games", price: 129.90, url: "https://www.epicgames.com/store/en-US/p/the-witcher-3" },
    { id: 4, name: "Cyberpunk 2077", store: "GOG", price: 149.90, url: "https://www.gog.com/game/cyberpunk_2077" },
    { id: 5, name: "Minecraft", store: "Microsoft Store", price: 89.90, url: "https://www.microsoft.com/store/p/minecraft" },
    { id: 6, name: "DOOM Eternal", store: "Steam", price: 99.90, url: "https://store.steampowered.com/app/782330" },
    { id: 7, name: "Red Dead Redemption 2", store: "Rockstar", price: 249.90, url: "https://www.rockstargames.com/reddeadredemption2" }
];

// Rota de raiz para testar se a API está funcionando
app.get("/", (req, res) => {
    res.send("API está funcionando! Acesse /games para ver os jogos.");
});

// Rota para buscar todos os jogos
app.get("/games", (req, res) => {
    res.json(games);
});

// Rota para buscar jogos de uma loja específica (Ex: Steam, Epic Games, etc)
app.get("/games/store/:store", (req, res) => {
    const storeGames = games.filter(g => g.store.toLowerCase() === req.params.store.toLowerCase());
    if (storeGames.length > 0) res.json(storeGames);
    else res.status(404).json({ error: "Nenhum jogo encontrado para essa loja" });
});

// Rota para buscar um jogo específico pelo nome
app.get("/games/:name", (req, res) => {
    const game = games.find(g => g.name.toLowerCase() === req.params.name.toLowerCase());
    if (game) res.json(game);
    else res.status(404).json({ error: "Jogo não encontrado" });
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
