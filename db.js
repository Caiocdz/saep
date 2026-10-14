
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'teste_api'
});


connection.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro);
    } else {
        console.log('Conexão com o banco de dados realizada com sucesso!');
    }
});


module.exports = connection;
