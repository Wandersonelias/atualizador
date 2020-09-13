DROP TABLE IF EXISTS `aliquotasinterestadual`;
CREATE TABLE `aliquotasinterestadual` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` int(11) NOT NULL,
  `destino` varchar(4) DEFAULT NULL,
  `aliquotaInterestadual` int(11) DEFAULT NULL,
  `cod_MudiPrincipal` varchar(140) DEFAULT NULL,
  `dc_Mudi` varchar(140) DEFAULT NULL,
  `txt_InfoComplementar` varchar(140) DEFAULT NULL,
  `dt_VigenciaInicial` varchar(140) DEFAULT NULL,
  `dt_VigenciaFinal` varchar(140) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
DROP TABLE IF EXISTS `aliquotasinterna`;
CREATE TABLE `aliquotasinterna` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` int(11) NOT NULL,
  `vlAliquota` varchar(10) DEFAULT NULL,
  `descricao` text,
  `infoComplementar` text,
  `baseLegal` text,
  `vigenciaInicial` varchar(140) DEFAULT NULL,
  `vigenciaFinal` varchar(140) DEFAULT NULL,
  `tipo_resultado` int(11) DEFAULT NULL,
  `aliquotaFCP` double DEFAULT NULL,
  `descricoFCP` text,
  `infoComplementarFCP` text,
  `baseLegalFCP` text,
  `vigenciaFinalFCP` varchar(20) DEFAULT NULL,
  `vigenciaInicialFCP` varchar(20) DEFAULT NULL,
  `destino` varchar(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
drop table if exists `aliquotamva`;
CREATE TABLE `aliquotamva`(
	  id int(11) NOT NULL AUTO_INCREMENT,
      codigo int(11) NOT NULL, #vinculador de operações entre as tabelas
      destino varchar(4),
      nsu_SegmentoProduto varchar(34) DEFAULT NULL,
      nm_SegmentoProduto varchar(140) DEFAULT NULL,
      nsu_CodigoIOB varchar(10) DEFAULT NULL,
      descricaoCodigoIOB  text,
      vl_MVA double DEFAULT NULL,
      vl_MVA_Ajustada double DEFAULT NULL,
      cod_MUDIPrincipal text DEFAULT NULL,
      dc_MUDI text DEFAULT NULL,
      percentualReduzMVA double DEFAULT NULL,
      consideraAliquotaAoFundoNoCalculoMVAAjustada double DEFAULT NULL,
      vigenciaInicial varchar(50) DEFAULT NULL,
      vigenciaFinal varchar(50) DEFAULT NULL,
      txt_InfoComplementar text,
      id_Conteudo_Certificado varchar(36),
      nsu_GrupoElementos varchar(11) default null,
      segmentoNaoAtendido varchar(6) default null,
      segmentoNaoAtendidoTexto text,
	  PRIMARY KEY (`id`)
)