const stream = require('stream');
/*
let FacebookFeed = function() {
    let readableStream = new stream.Readable({})
    objectMode : true;

    let updates = [
        {place:  "Im at UK"},
        { place: "Im at US"},
    ];
    readableStream._read = () => {
        if(updates.length){
            return readableStream.push(updates.shift() + "\t");
        }
        readableStream.push(null);
    }

    return readableStream;
}


let faceboof = FacebookFeed();


faceboof.on('readable',()=>{
    let data = faceboof.read();

    if(data)
        process.stdout.write(JSON.stringify(data));
});

faceboof.on('end',()=>{
    console.log("Sem mais dados");
});

*/

let Gravacao = new stream.Writable({});




Gravacao._write = (chunk, enconding, cb) => {
    console.log("Gravando stream", chunk.toString());
    cb();
};

var gravar = Gravacao.write("Beleza maluco");