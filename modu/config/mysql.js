var mysql = require('mysql');

var connection = mysql.createConnection({
    host : '3.39.120.219',
    user : 'es',
    password : 'modutracker',
    database : 'modu_api'
});

connection.connect(function(err) {
    if(err) {
        console.error('fail to connect: '+ err.stack);
        return;
    }
    console.log('Mysql connect!');
});

module.exports = connection;