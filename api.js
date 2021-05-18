const fs = require('fs');
const path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');

// Identificar si la ruta es file o folder

const ruta = "..\BOG002-data-lovers";
const ruta2 = "C:/Users/DELL/Documents/BOG002/BOG002-data-lovers/EXTRA.md";
const ruta3 = "C:/Users/DELL/Documents/BOG002/BOG002-data-lovers";
const arrayMd = [];


function DetectPath(ruta) {
    fs.stat(ruta, function (err, stats) {
        if (err) {
            return console.log('Ruta no encontrada');
        }

        // Verificar el tipo de archivo
        if (stats.isFile()) {
            console.log("La ruta corresponde a un archivo");
            if (path.extname(ruta) == ".md"){
                arrayMd.push(ruta)
                extraerLinks(arrayMd[0])
            }
            else {
                console.log('El archivo no es markdown')
            }
        }
        else if (stats.isDirectory()) {
            console.log("La ruta corresponde a un directorio");
            leerArchivos(ruta);
        }
    });
}

// Encontrar archivos .md
const leerArchivos = (ruta) => fs.readdir(ruta, (err, files) => {
    if (err) { console.log(err); }
    else {
        files.forEach(file => {
            if (path.extname(file) == ".md")
                arrayMd.push(file)
        })
        console.log(arrayMd);
    }
});

// Extraer links
function extraerLinks (file){
    const markdown = fs.readFileSync(file, { encoding: 'utf8' });

    const links = markdownLinkExtractor(markdown);
    
    links.forEach(link => {
        console.log(link);
    });
    
}

DetectPath(ruta2);


//const resolverRuta = (data) => path.resolve(data);

//console.log(resolverRuta(ruta))




module.exports = {
    DetectPath
};