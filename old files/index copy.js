const Readable = require('stream').Readable;
const axios = require('axios');
const rs = new Readable();
const Reader = require('../Reader');
const Processor = require('../Processor');

/*
rs.push("hey streams");
rs.push("how are you");
//rs.push(null);
console.log(Object.getPrototypeOf(rs));
rs.pipe(process.stdout);

class Api {
    static async getEndereco(cep){
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        console.log(response.data);
    }
    
}

Api.getEndereco(68904397);
*/


var leitor = new Reader();

async function main(){
    var dados = await leitor.Read('teste.csv');
    Processor.Process(dados);
};
main();

