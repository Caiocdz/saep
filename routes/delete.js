
const express = require('express');
const router = express.Router();
const connection = require('../db');

router.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({ erro: 'ID invalido' });
    }

    connection.execute(
        'DELETE FROM produtos WHERE id = ?',
        [id],
        (erro, resultado) => {
            if (erro) {
                console.error('Falha ao excluir produto no MySQL.');
                return res.status(500).json({ erro: 'Erro ao excluir produto' });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ erro: 'Produto não encontrado' });
            }

            res.json({ mensagem: 'Produto excluído!' });
        }
    );
});

module.exports = router;
