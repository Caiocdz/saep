
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/produtos', (req, res) => {
    pool.query('SELECT * FROM produtos', (erro, resultados) => {
        if (erro) {
            console.error('Falha ao listar produtos no MySQL.');
            return res.status(500).json({ erro: 'Erro ao listar produtos' });
        }

        res.json(resultados);
    });
});

module.exports = router;
