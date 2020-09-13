/*const { google } = require('googleapis');
const keys = require('./credentials.json');
const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']);


client.authorize((err,tokens)=>{
  if(err){
    console.log(err)
  }else{
    console.log("Conectado");
  }
})

const xlsx = require('xlsx');
const mysql = require('mysql');
var connect = mysql.createConnection({
  host: 'localhost',
  user: 'wanderson',
  password: 'regina',
  database: 'base'
  
});

connect.connect((err)=>{
  if(err){
    console.log("Erro", err);
  }else{
    console.log("Conectado");
  }
});

var planilha = xlsx.readFile('Cadastro.xlsx');
console.log(planilha.SheetNames);
var sheet = planilha.Sheets[ 'Planilha1'];
var convertida = xlsx.utils.sheet_to_json(sheet);


convertida.forEach(item =>{
  /*
  var dados = [
    { Id: item.Item,
      cest: item.CEST,
      ncm: item.NCM
    }
  ]
  var query = "INSERT INTO new_table (ncm, cest) VALUES ('"+item.NCM+"','"+item.CEST+"')";
  connect.query(query,function (error, results, fields) {
    if(error) throw error;
    console.log(results.insertId);
  });
  
});
const {Builder, Key, By, WebElement, promise} = require('selenium-webdriver');
const { ValueType } = require('exceljs');

var driver = new Builder().forBrowser('chrome').build();
var list_search = ['webdriver','webdriver-js','webdriver-py'];


driver.get('http://registro.br');
var searchForm = driver.findElement(By.xpath('//form'));
var searchBox = searchForm.findElement(By.name('is-avail'));
searchBox.sendKeys(list_search[0],Key.RETURN);

const events = require('events').EventEmitter;
const emitter = new events.EventEmitter();

emitter.on('nodejspost',(data)=>{
  console.log(data);
});
emitter.emit('nodejspost',"aqui e novo");

//const block = fs.readFileSync('small');

fs.readFileSync("small",(err,data)=>{
  fs.writeFileSync("small-copy",data,()=>{
    console.log("File savede");
  });
});
*/


const fs = require('fs');
fs.createReadStream('small')
.pipe(fs.createWriteStream('small-copy'),(err, data)=>{
  console.log("Teste");
});