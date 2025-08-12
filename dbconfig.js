const sql = require('mssql');

const config = {
    user: 'SA',
    password: 'reallyStrongPwd123',
    server: 'localhost',
    database: 'IlkivMakeup',
    options: {
        encrypt: true, // Windows Azure
        trustServerCertificate: true
    }
};

module.exports = config;
