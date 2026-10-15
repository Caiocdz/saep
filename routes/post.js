
const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/produtos', (req, res) => {
    const { nome, preco } = req.body || {};

    if (typeof nome !== 'string' || !nome.trim() ||
        !['number', 'string'].includes(typeof preco) ||
        String(preco).trim() === '' || !Number.isFinite(Number(preco))) {
        return res.status(400).json({ erro: 'Informe nome e preço' });
    }

    connection.execute(
        'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
        [nome, preco],
        (erro, resultado) => {
            if (erro) {
                console.error('Falha ao cadastrar produto no MySQL.');
                return res.status(500).json({ erro: 'Erro ao cadastrar produto' });
            }

            res.status(201).json({
                mensagem: 'Produto cadastrado!',
                id: resultado.insertId
            });
        }
    );
});

module.exports = router;
