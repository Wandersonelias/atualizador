/*         
//inicio das operções de mva
function adicionarMva(dados,codigo,uf) {
    var rows_mva = [];
    rows_mva.push(dados.mva);
    console.log("----------------matris inicio---------------------");
    console.log(rows_mva);
    console.log("---------------matriz fim----------------------");
    
    rows_mva[0].forEach(dados => {
        var mva = 
            {
                codigo: codigo,
                nsu_SegmentoProduto: dados.nsu_SegmentoProduto,
                nm_SegmentoProduto: dados.nm_SegmentoProduto,
                nsu_CodigoIOB: dados.nsu_CodigoIOB,
                descricaoCodigoIOB: dados.descricaoCodigoIOB,
                vl_MVA: dados.vl_MVA,
                vl_MVA_Ajustada: dados.vl_MVA_Ajustada,
                cod_MUDIPrincipal: dados.cod_MUDIPrincipal,
                dc_MUDI: dados.dc_MUDI,
                percentualReduzMVA: dados.percentualReduzMVA,
                consideraAliquotaAoFundoNoCalculoMVAAjustada: dados.consideraAliquotaAoFundoNoCalculoMVAAjustada,
                vigenciaInicial: dados.vigenciaInicial,
                vigenciaFinal: dados.vigenciaFinal,
                txt_InfoComplementar: dados.vigenciaFinal,
                id_Conteudo_Certificado: dados.id_Conteudo_Certificado,
                nsu_GrupoElementos: dados.nsu_GrupoElementos,
                segmentoNaoAtendido: dados.segmentoNaoAtendido,
                segmentoNaoAtendidoTexto: dados.segmentoNaoAtendidoTexto
              
        };

        console.log(mva);
        var mva_query = `INSERT INTO tributei_analise.aliquotamva (codigo,destino, nsu_SegmentoProduto, nm_SegmentoProduto, nsu_CodigoIOB, descricaoCodigoIOB, vl_MVA, vl_MVA_Ajustada, cod_MUDIPrincipal, dc_MUDI,percentualReduzMVA, consideraAliquotaAoFundoNoCalculoMVAAjustada, vigenciaInicial,vigenciaFinal,txt_InfoComplementar,id_Conteudo_Certificado,nsu_GrupoElementos,segmentoNaoAtendido, segmentoNaoAtendidoTexto) VALUES 
        ('${mva.codigo}','${uf}','${mva.nsu_SegmentoProduto}', '${mva.nm_SegmentoProduto}', '${mva.nsu_CodigoIOB}', '${mva.descricaoCodigoIOB.replace("'"," ")}', 
        '${mva.vl_MVA}', '${mva.vl_MVA_Ajustada}', '${mva.cod_MUDIPrincipal}', '${mva.dc_MUDI}', '${mva.percentualReduzMVA}', '${mva.consideraAliquotaAoFundoNoCalculoMVAAjustada}', 
        '${mva.vigenciaInicial}', '${mva.vigenciaFinal}', '${mva.txt_InfoComplementar}', '${mva.id_Conteudo_Certificado}',
        '${mva.nsu_GrupoElementos}', '${mva.segmentoNaoAtendido}','${mva.segmentoNaoAtendidoTexto}')`;

        var inserir_mva = conection.query(mva_query,(erro,rows)=>{
            if(erro) throw erro;
            console.log(inserir_mva.sql);
        });
        console.log("Finalizado!");
    });

}

router.get('/aliquotas-mvas',(req,res)=>{

    var mva_params = {
        contador: parseInt(req.query.contador),
        estado: req.query.estado
    };
    console.log("Contador: " + mva_params.contador, "Estado: " + mva_params.estado);
    var query_select_five = `SELECT produto.id_iob, produto.descricao,produto.codigoNcm, produto.cest , produto.segmentoCEST,estadual.codigo, estadual.aliquotaInterestadual, interna.vlAliquota,interna.aliquotaFCP, interna.destino  FROM  aliquotasinterestadual as estadual, aliquotasinterna as interna, produtos as produto where estadual.codigo = interna.codigo and produto.codigo = estadual.codigo and 
    estadual.destino = '${mva_params.estado}' and interna.destino = '${mva_params.estado}' and estadual.codigo > ${mva_params.contador} order by estadual.codigo limit 200`;
    conection.query(query_select_five,(erros, rows)=>{
            if(erros) throw erros;
            rows.forEach((item,index) => {
                console.log( "indice: " + index + "-" + item.id_iob + " - " + item.destino+" - "+ item.aliquotaInterestadual);
                axios.get(`https://api.iob.com.br/gestor-fiscal/v1/itens/${item.id_iob}/icms-aliquotas/mva?empresa_id=7d420432-fe69-48a1-959f-d8c4738d087e&uf=${item.destino}&estabelecimento=atacadista&destinacao=comercializacao-saidas&aliquota_interestadual=${item.aliquotaInterestadual}&aliquota_interna=${item.vlAliquota}&aliquota_fcp=${item.aliquotaFCP}`,config)
                .then(response =>{
                    console.log("Index: " + index);
                    if(response.data == " " || response.data == 0 || response.data == false){
                        console.log("Index: " + index);
                        var mva_query = `INSERT INTO tributei_analise.aliquotamva 
                        (codigo, destino, nsu_SegmentoProduto, nm_SegmentoProduto, nsu_CodigoIOB, descricaoCodigoIOB, vl_MVA, vl_MVA_Ajustada, cod_MUDIPrincipal, dc_MUDI,percentualReduzMVA, consideraAliquotaAoFundoNoCalculoMVAAjustada, vigenciaInicial,vigenciaFinal,txt_InfoComplementar,id_Conteudo_Certificado,nsu_GrupoElementos,segmentoNaoAtendido, segmentoNaoAtendidoTexto) VALUES 
                        ('${item.codigo}','${item.destino}','${null}','${null}','${null}','${0}', '${0}', '${0}', '${null}', '${0}', '${0}', 
                        '${0}', '${null}', '${null}', '${null}',
                        '${0}', '${0}','${null}','${null}')`;
                        var inserir_mva = conection.query(mva_query,(erro,rows)=>{
                            if(erro) throw erro;
                            console.log(inserir_mva.sql);
                        });
                        console.log("Gravado com sucesso! - null");
                    }else{
                        adicionarMva(response.data,item.codigo,item.destino);
                        console.log("Gravado com sucesso!");
                    }    
                    res.render('produtos/consultas',{produtos: rows});
                }).catch(err =>{
                    console.log("Error tipo: " + err);
                })

            })
            //res.send("OK");           
        });

       
    //}
    
            
        
            /*    axios.get(`https://api.iob.com.br/gestor-fiscal/v1/itens/${id_iob}/icms-aliquotas/mva?empresa_id=7d420432-fe69-48a1-959f-d8c4738d087e&uf=${uf}&estabelecimento=atacadista&destinacao=comercializacao-saidas&aliquota_interestadual=${interEstadual}&aliquota_interna=${AliqInterna}&aliquota_fcp=${Fcp}`,config)
                .then( response =>{
                    if(!response.data){
                        var mva_query = `INSERT INTO tributei_analise.aliquotamva (codigo, destino, nsu_SegmentoProduto, nm_SegmentoProduto, nsu_CodigoIOB, descricaoCodigoIOB, vl_MVA, vl_MVA_Ajustada, cod_MUDIPrincipal, dc_MUDI,percentualReduzMVA, consideraAliquotaAoFundoNoCalculoMVAAjustada, vigenciaInicial,vigenciaFinal,txt_InfoComplementar,id_Conteudo_Certificado,nsu_GrupoElementos,segmentoNaoAtendido, segmentoNaoAtendidoTexto) VALUES 
                        ('${codigo}','${uf}', '${null}', '${null}', '${null}', 
                        '${0}', '${0}', '${null}', '${null}', '${0}', '${0}', 
                        '${null}', '${null}', '${null}', '${null}',
                        '${0}', '${null}','${null}','${null}')`;
                        var inserir_mva = conection.query(mva_query,(erro,rows)=>{
                            if(erro) throw erro;
                            console.log(inserir_mva.sql);
                        });
                        console.log("Gravado com sucesso!");
                    }else{
                        adicionarMva(response.data,codigo,uf);
                        console.log("Gravado com sucesso!"); 
                    }
                }).catch(err =>{
                    console.log(err);
                });
                //Fim da função extrair mvas
            }
                    */

    
                });
    
                module.exports = router;