const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3307),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testar a conexão
pool.getConnection((erro, connection) => {
    if (erro) {
        console.error('Erro ao conectar ao MySQL:', erro.message);
    } else {
        console.log('MySQL conectado com sucesso!');
        connection.release();
    }
});

module.exports = pool;
