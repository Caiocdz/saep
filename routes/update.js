
const express = require('express');
const router = express.Router();
const connection = require('../db');

router.put('/produtos/:id', (req, res) => {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({ erro: 'ID invalido' });
    }
    const { nome, preco } = req.body || {};

    if (typeof nome !== 'string' || !nome.trim() ||
        !['number', 'string'].includes(typeof preco) ||
        String(preco).trim() === '' || !Number.isFinite(Number(preco))) {
        return res.status(400).json({ erro: 'Informe nome e preço' });
    }

    connection.execute(
        'UPDATE produtos SET nome = ?, preco = ? WHERE id = ?',
        [nome, preco, id],
        (erro, resultado) => {
            if (erro) {
                console.error('Falha ao atualizar produto no MySQL.');
                return res.status(500).json({ erro: 'Erro ao atualizar produto' });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ erro: 'Produto não encontrado' });
            }

            res.json({ mensagem: 'Produto atualizado!' });
        }
    );
});

module.exports = router;
