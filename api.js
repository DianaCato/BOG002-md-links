const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const markdownLinkExtractor = require('./markdownw-links-extractor-modificado/markdownLinksExtractor.js');
const { extname, resolve } = require('path');

// Majeno de la ruta 

function DetectPath(ruta) {
    return new Promise(function (resolve, reject) {
        let archivosMd;
        let dataFinal;
        rutaNoExiste(ruta).then(noExiste =>
            noExiste ? reject(new Error('La ruta no existe'))
                : recursion(ruta).then(data => {
                    if (typeof data == 'string') {
                        fs.stat(data, function (err, stats) {
                            if (err) {
                                reject(err.message);
                            }
                            if (stats.isFile()) {
                                path.extname(data) == '.md' ?
                                    extraerLinks(data).then(dataLinks => {
                                        resolve(dataLinks)
                                    })
                                    : resolve('La ruta no es de un archivo markdown')
                            }
                        })
                    }
                    else {
                        archivosMd = data.join(',').split(',')
                        const filtradoMd = archivosMd.filter(file => file.includes('.md'))
                        const promesasLinks = [];
                        filtradoMd.forEach(file => {
                            promesasLinks.push(extraerLinks(file))
                        })
                        promesasLinks.length == 0 ? resolve('La ruta no contiene archivos markdown')
                            : Promise.all(promesasLinks).then(data =>
                                resolve(dataFinal = data)
                            )
                    }
                })

        )
    })

}

// Verificar si la ruta existe
function rutaNoExiste(ruta) {
    return new Promise(function (resolve) {
        fs.access(ruta, fs.constants.F_OK, (error) => {
            error ? resolve(true) : resolve(false);
        })
    })
}

// Recursion si la ruta es un archivo
function recursion(ruta) {
    if (ruta.includes('node_modules')) {
        return;
    }
    return new Promise(function (resolve, reject) {
        let arreglo;
        const promesas = [];
        fs.stat(ruta, function (err, stats) {
            if (err) {
                reject(err.message);
            }
            stats.isDirectory() ? leerArchivos(ruta).then(files => {
                for (let i = 0; i < files.length; i++) {
                    promesas.push(recursion(files[i]))
                }
                Promise.all(promesas).then(resp => resolve(arreglo = resp))
            })
                : resolve(arreglo = ruta)
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
                    arrayFiles.push(`${ruta}/${file}`);
                })
            }
            resolve(arrayFiles)
        });
    })
}

// Extraer links
function extraerLinks(file) {
    return new Promise(function (resolve, reject) {
        const markdown = fs.readFileSync(file, { encoding: 'utf8' });

        const links = markdownLinkExtractor(markdown);
        const data = [];
        links.forEach(link => {
            if (link[0].includes('http')) {
                data.push({
                    href: link[0],
                    text: link[1],
                    file,
                })
            }
        })
        if (data.length == 0)
            resolve(`El archivo ${file} no contiene links`);
        else
            resolve(data)
    })
}

// fetch('https://nodejs.org/')
//   .then(response =>{ 

//     console.log(response.status);
//   });;

module.exports = {
    DetectPath
};
