
const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/produtos', (req, res) => {
    connection.query('SELECT * FROM produtos', (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }

        res.json(resultados);
    });
});

module.exports = router;
