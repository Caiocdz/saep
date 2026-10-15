const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', (req, res) => {
    res.json({ mensagem: 'API funcionando' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const get = require('./routes/get');
const post = require('./routes/post');
const update = require('./routes/update');
const deletar = require('./routes/delete');

app.use(get);
app.use(post);
app.use(update);
app.use(deletar);

app.use((erro, req, res, next) => {
    if (res.headersSent) return next(erro);
    if (erro.type === 'entity.parse.failed') {
        return res.status(400).json({ erro: 'JSON invalido' });
    }
    if (erro.type === 'entity.too.large') {
        return res.status(413).json({ erro: 'Corpo da requisicao muito grande' });
    }
    console.error('Erro ao processar requisicao.');
    return res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;
