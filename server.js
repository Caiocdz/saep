// app carrega db.js, que le o .env antes de consultar PORT.
const app = require('./app');
const pool = require('./db');

const PORT = process.env.PORT || 3000;

pool.getConnection((erro, connection) => {
    if (erro) {
        console.error('Nao foi possivel conectar ao MySQL. Confira as variaveis DB_* e a rede.');
        pool.end();
        process.exitCode = 1;
        return;
    }
    connection.release();
    console.log('Conexao com o MySQL realizada com sucesso!');
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
    server.on('error', () => {
        console.error('Nao foi possivel iniciar o servidor HTTP. Confira PORT.');
        pool.end();
        process.exitCode = 1;
    });
});
