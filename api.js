const fs = require('fs');
const path = require('path');
const markdownLinkExtractor = require('./markdownw-links-extractor-modificado/markdownLinksExtractor.js');

// Identificar si la ruta es file o folder

function DetectPath(ruta) {
    return new Promise(function (resolve, reject) {
        fs.stat(ruta, function (err, stats) {
            // Verificar el tipo de archivo
            if (err) {
                reject(err.message);
            }
            if(stats.isDirectory()) {
                leerArchivos(ruta).then(res => {
                    resolve(res)
                });
            }
            if (stats.isFile()) {
                extraerLinks(ruta).then(data => {
                    resolve(data)
                })
                .catch(err => reject(err));
            }
        
        })

    })
}

// Encontrar archivos .md
function leerArchivos(ruta) {
    return new Promise(function (resolve, reject) {
        fs.readdir(ruta, (err, files) => {
            let arrayFiles = [];
            if (err) { reject(err); }
            else {
                files.forEach(file => {
                    if (path.extname(file) == ".md")
                        arrayFiles.push(file);
                })
                if (arrayFiles.length == 0)
                  arrayFiles = "No se encontraron archivos markdown"
            }
            resolve(arrayFiles)
        });
    })
}

// Extraer links
function extraerLinks(file) {
    return new Promise (function (resolve, reject){
        const markdown = fs.readFileSync(file, { encoding: 'utf8' });

        const links = markdownLinkExtractor(markdown);
        const data = [];
        links.forEach(link => {
           if(link[0].includes('http')){
            data.push({
                href : link[0],
                text : link[1],
                file,
            })
           } 
        })
        if(data.length == 0)
        reject("El archivo no contiene links");
        else 
        resolve(data)
    })
}

module.exports = {
    DetectPath
};