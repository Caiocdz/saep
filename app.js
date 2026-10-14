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

module.exports = app;
