
const express = require('express');
const router = express.Router();
const connection = require('../db');

router.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;

    connection.query(
        'DELETE FROM produtos WHERE id = ?',
        [id],
        (erro, resultado) => {
            if (erro) {
                return res.status(500).json({ erro: erro.message });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ erro: 'Produto não encontrado' });
            }

            res.json({ mensagem: 'Produto excluído!' });
        }
    );
});

module.exports = router;
