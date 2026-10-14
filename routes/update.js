
const express = require('express');
const router = express.Router();
const connection = require('../db');

router.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco } = req.body;

    if (!nome || preco == null) {
        return res.status(400).json({ erro: 'Informe nome e preço' });
    }

    connection.query(
        'UPDATE produtos SET nome = ?, preco = ? WHERE id = ?',
        [nome, preco, id],
        (erro, resultado) => {
            if (erro) {
                return res.status(500).json({ erro: erro.message });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ erro: 'Produto não encontrado' });
            }

            res.json({ mensagem: 'Produto atualizado!' });
        }
    );
});

module.exports = router;
