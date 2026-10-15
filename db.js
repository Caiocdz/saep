const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
const mysql = require('mysql2');

const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
    throw new Error(`Variaveis de ambiente obrigatorias ausentes: ${missing.join(', ')}`);
}
const port = Number(process.env.DB_PORT);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT deve ser uma porta valida.');
}
if (process.env.RAILWAY_ENVIRONMENT_ID &&
    !process.env.DB_HOST.endsWith('.railway.internal')) {
    throw new Error('Na Railway, DB_HOST deve usar o dominio privado do MySQL (*.railway.internal).');
}

// Mantem a interface de callbacks das rotas e renova conexoes.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 100,
    connectTimeout: 10000,
    enableKeepAlive: true
});
module.exports = pool;
