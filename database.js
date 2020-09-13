const mysql = require('mysql');

var umblerpath = 'mysql669.umbler.com';
var umbleruser = 'tributei';
var umblerpass = 'tributei1020';
const conection = mysql.createConnection({
    host: 'localhost', //Umbler local => mysql669.umbler.com
    user: 'wanderson', //Umbler user => tributei
    password: 'regina',//Umlber pass => tributei1020
    database: 'tributei_analise',

});

conection.connect((err)=>{
    if(err) throw err;
    console.log('Conectado');
});

//Selecionar todos os usuarios do banco de sa
//teste


module.exports = conection;