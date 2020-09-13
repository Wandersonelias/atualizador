console.log("Teste de arquivos");
//const express = require('express');
//const router = express.Router();
//const conection = require('./database');
const Credentials = require('./Credentials');
const axios = require('axios');

const config = {
    //method: params.method,
    //url: params.url,
    params: {
        _page: 1,
        _limit: 3200,
        uf: "AC",
        estabelecimento: "atacadista",
        destinacao: "comercializacao-saidas"
    
    },
    path: {
        empresa_id: '7d420432-fe69-48a1-959f-d8c4738d087e',
    },
    headers: {
        "Content-Type": "application/json",
        "client_id": Credentials.cliente_id(),
        "access_token": Credentials.token_access(),
    }
};

const mysql = require('mysql'); // or use import if you use TS
    const util = require('util');
    const conn = mysql.createConnection({
        host: 'localhost', //Umbler local => mysql669.umbler.com
        user: 'wanderson', //Umbler user => tributei
        password: 'regina',//Umlber pass => tributei1020
        database: 'tributei_analise'
});
const query = util.promisify(conn.query).bind(conn);

async function produtos() {
    
    var tempo = new Date();
    const rows = await query('select id_iob,cest,codigoNcm,codigo from produtos where codigo > 0 order by codigo limit 3115');
    for(var i=0; i<rows.length; i++){
        console.log("ok: " + rows[i].id_iob);
        const pedidos = await axios.get(`https://api.iob.com.br/gestor-fiscal/v1/itens/${rows[i].id_iob}/icms-aliquotas?empresa_id=${config.path.empresa_id}`,config);
            
            console.log(rows[i].codigo, "index: " + i );        
            var aliq = pedidos.data.aliquotaInterestadual.vl_Aliquota;
            console.log("Valor ",aliq);
//Continuar daqui
            var query_insert_aliqEst = `INSERT INTO tributei_analise.aliquotasinterestadual (codigo, destino, aliquotaInterestadual, cod_MudiPrincipal,dc_Mudi, txt_InfoComplementar, dt_VigenciaInicial, dt_VigenciaFinal) VALUES 
            ('${rows[i].codigo}','${config.params.uf}','${aliq}', '${pedidos.data.aliquotaInterestadual.cod_MudiPrincipal}', '${pedidos.data.aliquotaInterestadual.dc_Mudi}', '${pedidos.data.aliquotaInterestadual.txt_InfoComplementar}', '${pedidos.data.aliquotaInterestadual.dt_VigenciaInicial}', '${pedidos.data.aliquotaInterestadual.dt_VigenciaFinal}')`;    
            await query(query_insert_aliqEst);
            
        
        var aliquotaInterna = await pedidos.data.aliquotaInterna;
        var aliquotaFCP = await pedidos.data.aliquotaFCP;
        for (const key in aliquotaInterna) {
            console.log("Valor Aliquota 1: ",aliquotaInterna[key].vlAliquota);
            console.log("Valor base legal 1: ",aliquotaInterna[key].baseLegal);
                    console.log("--------------------------Separador-------------------------------");
            var query_insert_aliqInt = `INSERT INTO tributei_analise.aliquotasinterna (codigo, vlAliquota,descricao,infoComplementar,baseLegal,vigenciaInicial,vigenciaFinal,tipo_resultado,destino) VALUES 
            ('${rows[i].codigo}'
            ,'${aliquotaInterna[key].vlAliquota}'
            ,'${aliquotaInterna[key].descricao.replace("'","")}'
            ,'${aliquotaInterna[key].infoComplementar}'
            ,'${aliquotaInterna[key].baseLegal}'
            ,'${aliquotaInterna[key].vigenciaInicial}'
            ,'${aliquotaInterna[key].vigenciaFinal}'
            ,'${key}'
            ,'${config.params.uf}')`;
            query(query_insert_aliqInt);
            
            
            if(aliquotaFCP){
                for (const key in aliquotaFCP) {
                    var insert_fcp = `INSERT INTO tributei_analise.aliquotafcp
                    (codigo
                    ,tipo_resultado
                    ,aliquotaFCP
                    ,descricoFCP
                    ,infoComplementarFCP
                    ,baseLegalFCP
                    ,vigenciaInicialFCP
                    ,vigenciaFinalFCP
                    ,destino) VALUES 
                    ('${rows[i].codigo}',
                    '${key}',
                    '${aliquotaFCP[key].vlAliquota}',
                    '${aliquotaFCP[key].descricao.replace("'","")}',
                    '${aliquotaFCP[key].infoComplementar.replace("'","")}',
                    '${aliquotaFCP[key].baseLegal}',
                    '${aliquotaFCP[key].vigenciaInicial}',
                    '${aliquotaFCP[key].vigenciaFinal}',
                    '${config.params.uf}')`;
                    console.log("Valor FCP"+ key+":",aliquotaFCP[key].vlAliquota);
                    console.log("Valor FCP: "+key+":",aliquotaFCP[key].baseLegal);
                    console.log("--------------------------Separador-------------------------------");
                    await query(insert_fcp);
            
                }
            }
        }
        }
                                 
}
const getAxios = async () => {
    //gravando na API
    const resPedido = await axios.post(`http://minhaapi.com.br/pedidos/criar.json`, {
        nome: "dados",
        id: 1
    });
    //resposta do POST
    console.log(resPedido)


    //buscando API
    const pedidos = await axios.get(`http://minhaapi.com.br/pedidos.json`);
    for(let pedido of pedidos){
        console.log(pedido);

        let pedidoGravar = new PedidoMysql()
        pedidoGravar.id = pedido.id
        pedidoGravar.nome = pedido.nome
        await pedidoGravar.save()
    } 
    
}
/*
produtos().then(dados =>{
    var data = new Date();
    //data.toLocaleTimeString();
    console.log("Finalizado " + data.toLocaleTimeString());
});
*/
async function produtosMVA() {
    var normal = 'SELECT distinctrow produto.id_iob, estadual.destino, estadual.aliquotaInterestadual,estadual.codigo,interna.vlAliquota,fcp.aliquotaFCP FROM tributei_analise.aliquotasinterestadual as estadual, tributei_analise.aliquotasinterna as interna, produtos as produto, aliquotafcp as fcp where estadual.codigo = interna.codigo and produto.codigo = estadual.codigo and estadual.codigo = fcp.codigo and estadual.destino = "AL" and interna.destino = "AL" and produto.codigo > 0 order by codigo';
    var caso_acre = 'SELECT distinctrow produto.id_iob, estadual.destino, estadual.aliquotaInterestadual,estadual.codigo,interna.vlAliquota,fcp.aliquotaFCP=0 FROM tributei_analise.aliquotasinterestadual as estadual, tributei_analise.aliquotasinterna as interna, produtos as produto, aliquotafcp as fcp where estadual.codigo = interna.codigo and produto.codigo = estadual.codigo and estadual.codigo = fcp.codigo and estadual.destino = "AC" and interna.destino = "AC" and produto.codigo > 0 order by codigo';
    const rows = await query(caso_acre);
    for (const key_row in rows) {
        const req_mva = await axios.get(`https://api.iob.com.br/gestor-fiscal/v1/itens/${rows[key_row].id_iob}/icms-aliquotas/mva?empresa_id=7d420432-fe69-48a1-959f-d8c4738d087e&uf=${config.params.uf}&estabelecimento=atacadista&destinacao=comercializacao-saidas&aliquota_interestadual=${parseInt(rows[key_row].aliquotaInterestadual)}&aliquota_interna=${parseInt(rows[key_row].vlAliquota)}&aliquota_fcp=${/*parseInt(rows[key_row].aliquotaFCP)*/0}`,config);
            let mva = await req_mva.data.mva;
            for (const key in mva) {
                if(mva){
                    let codigo = rows[key_row].codigo;
                    console.log(codigo, "Com MVA");
                    var mva_query_mva_null = `INSERT INTO tributei_analise.aliquotamva (
                        codigo,
                        destino,
                        nsu_SegmentoProduto,
                        nm_SegmentoProduto, 
                        nsu_CodigoIOB, 
                        descricaoCodigoIOB, 
                        vl_MVA, 
                        vl_MVA_Ajustada, 
                        cod_MUDIPrincipal, 
                        dc_MUDI,percentualReduzMVA, 
                        consideraAliquotaAoFundoNoCalculoMVAAjustada, 
                        vigenciaInicial,
                        vigenciaFinal,
                        txt_InfoComplementar,
                        id_Conteudo_Certificado,
                        nsu_GrupoElementos,
                        segmentoNaoAtendido, 
                        segmentoNaoAtendidoTexto) VALUES (
                        '${codigo}',
                        '${config.params.uf}', 
                        '${mva[key].nsu_SegmentoProduto}', 
                        '${mva[key].nm_SegmentoProduto}', 
                        '${mva[key].nsu_CodigoIOB}', 
                        '${mva[key].descricaoCodigoIOB}', 
                        '${mva[key].vl_MVA}', 
                        '${mva[key].vl_MVA_Ajustada}', 
                        '${mva[key].cod_MUDIPrincipal}', 
                        '${mva[key].dc_MUDI}', 
                        '${mva[key].percentualReduzMVA}', 
                        '${mva[key].consideraAliquotaAoFundoNoCalculoMVAAjustada}', 
                        '${mva[key].vigenciaInicial}', 
                        '${mva[key].vigenciaFinal}', 
                        '${mva[key].txt_InfoComplementar}',
                        '${mva[key].id_Conteudo_Certificado}', 
                        '${mva[key].nsu_GrupoElementos}',
                        '${mva[key].segmentoNaoAtendido}',
                        '${mva[key].segmentoNaoAtendidoTexto}')`;
                        query(mva_query_mva_null);
                        console.log("codigo :",rows[key_row].codigo, " Id: ", rows[key_row].id_iob);
                        }

                else{
                    console.log("codigo não tem MVA:",rows[key_row].codigo, " Id: ", rows[key_row].id_iob);
                    //console.log(mva);
                    /*
                    var mva_query_completa = `INSERT INTO tributei_analise.aliquotamva (
                        codigo,
                        destino,
                        nsu_SegmentoProduto,
                        nm_SegmentoProduto,
                        nsu_CodigoIOB,
                        descricaoCodigoIOB,
                        vl_MVA,
                        vl_MVA_Ajustada,
                        cod_MUDIPrincipal,
                        dc_MUDI,
                        percentualReduzMVA,
                        consideraAliquotaAoFundoNoCalculoMVAAjustada,
                        vigenciaInicial,
                        vigenciaFinal,
                        txt_InfoComplementar,
                        id_Conteudo_Certificado,
                        nsu_GrupoElementos,
                        segmentoNaoAtendido,
                        segmentoNaoAtendidoTexto)
                        VALUES(
                        '${rows[key_row].codigo}',
                        '${config.params.uf}',
                        '${mva[key].nsu_SegmentoProduto}',
                        '${mva[key].nm_SegmentoProduto}',
                        '${mva[key].nsu_CodigoIOB}', 
                        '${mva[key].descricaoCodigoIOB}',
                        '${mva[key].vl_MVA}',
                        '${mva[key].vl_MVA_Ajustada}',
                        '${mva[key].cod_MUDIPrincipal}',
                        '${mva[key].dc_MUDI}',
                        '${mva[key].percentualReduzMVA}',
                        '${mva[key].consideraAliquotaAoFundoNoCalculoMVAAjustada}', 
                        '${mva[key].vigenciaInicial}',
                        '${mva[key].vigenciaFinal}',
                        '${mva[key].txt_InfoComplementar}',
                        '${mva[key].id_Conteudo_Certificado}',
                        '${mva[key].nsu_GrupoElementos}',
                        '${mva[key].segmentoNaoAtendido}',
                        '${mva[key].segmentoNaoAtendidoTexto}'),
                        `;

                        console.log(mva_query_completa);
                        query(mva_query_completa);
                      */   
                }
            }

       
    
        }      
}
var data_inicio = new Date();
console.log("Finalizado " + data_inicio.toLocaleTimeString());
produtosMVA().then(()=>{
    var data_termino = new Date();
    console.log("Finalizado " + data_termino.toLocaleTimeString());
    
});
        





   