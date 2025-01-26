const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Simulação de banco de dados (por enquanto)
const games = [
    { id: 1, name: "Elden Ring", store: "Nuuvem", price: 199.90, url: "https://www.nuuvem.com/elden-ring" },
    { id: 2, name: "GTA V", store: "Steam", price: 75.00, url: "https://store.steampowered.com/app/271590" }
];

// Rota para buscar todos os jogos
app.get("/games", (req, res) => {
    res.json(games);
});

// Rota para buscar um jogo específico
app.get("/games/:name", (req, res) => {
    const game = games.find(g => g.name.toLowerCase() === req.params.name.toLowerCase());
    if (game) res.json(game);
    else res.status(404).json({ error: "Jogo não encontrado" });
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
