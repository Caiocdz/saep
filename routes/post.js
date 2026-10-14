
const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/produtos', (req, res) => {
    const { nome, preco } = req.body;

    if (!nome || preco == null) {
        return res.status(400).json({ erro: 'Informe nome e preço' });
    }

    connection.query(
        'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
        [nome, preco],
        (erro, resultado) => {
            if (erro) {
                return res.status(500).json({ erro: erro.message });
            }

            res.status(201).json({
                mensagem: 'Produto cadastrado!',
                id: resultado.insertId
            });
        }
    );
});

module.exports = router;