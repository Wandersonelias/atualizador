class Processor {
    static Process(data){
        var linhas = data.split("\n")
        var linhas_separadas = [];

        linhas.forEach(linha => {
            var arr = linha.split(',');
            linhas_separadas.push(arr);
        });

        return linhas_separadas;
    }
}

module.exports = Processor;