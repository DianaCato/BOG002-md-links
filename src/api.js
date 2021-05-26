const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const markdownLinkExtractor = require('../markdownw-links-extractor-modificado/markdownLinksExtractor.js');

// Majeno de la ruta 

function DetectPath(ruta) {
    return new Promise(function (resolve, reject) {
        let archivosMd;
        existeRuta(ruta).then(noExiste =>
            noExiste ? reject(new Error('La ruta no existe'))
                : buscadorDeArchivos(ruta).then(data => {
                    if (typeof data == 'string') {
                        fs.stat(data, function (err, stats) {
                            if (err) {
                                reject(err)
                            }
                            if (stats.isFile()) {
                                path.extname(data) == '.md' ?
                                    extraerLinks(data).then(dataLinks => {
                                        resolve(dataLinks)
                                    })
                                    : reject(new Error('La ruta no es de un archivo markdown'))
                            }
                        })
                    }
                    else {
                        const todosLosArchivos = data.join(',').split(',')
                        const filtradoArchivosMd = todosLosArchivos.filter(file => file.includes('.md'))
                        const promesasLinks = [];
                        filtradoArchivosMd.forEach(file => {
                            promesasLinks.push(extraerLinks(file))
                        })
                        promesasLinks.length == 0 ? reject(new Error('La ruta no contiene archivos markdown'))
                            : Promise.all(promesasLinks).then(dataFinal => {
                                resolve(Array.prototype.concat(...dataFinal))
                            })
                    }
                })
        )
    })
}

function existeRuta(ruta) {
    return new Promise(function (resolve) {
        fs.access(ruta, fs.constants.F_OK, (error) => {
            error ? resolve(true) : resolve(false);
        })
    })
}

function buscadorDeArchivos(ruta) {
    if (ruta.includes('node_modules')) {
        return;
    }
    return new Promise(function (resolve, reject) {
        //let arreglo;
        const promesas = [];
        fs.stat(ruta, function (err, stats) {
            if (err) {
                reject(err);
            }
            stats.isDirectory() ? rutasDeArchivos(ruta).then(files => {
                for (let i = 0; i < files.length; i++) {
                    promesas.push(buscadorDeArchivos(files[i]))
                }
                Promise.all(promesas).then(resp => resolve(resp))
            })
                : resolve(ruta)
        })
    })
}

function rutasDeArchivos(ruta) {
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
    return new Promise(function (resolve) {
        const markdown = fs.readFileSync(file, { encoding: 'utf8' });
        const links = markdownLinkExtractor(markdown);
        const data = [];
        links.forEach(link => {
            if (link[0].includes('http')) {
                data.push(
                    {
                        href: link[0],
                        text: link[1],
                        file,
                    }
                )
            }
        })

        resolve(data)
    })
}

// Validar links
const Status = (Link) => {
    return new Promise(function (resolve) {
        fetch(Link.href)
            .then(response => {
                if (response.status >= 200 && response.status <= 399) {
                    resolve({
                        href: Link.href,
                        text: Link.text.substr(0, 15),
                        file: Link.file,
                        status: response.status,
                        ok: 'Ok'
                    })
                } else if (response.status < 200 || response.status >= 400) {
                    resolve({
                        href: Link.href,
                        text: Link.text.substr(0, 15),
                        file: Link.file,
                        status: response.status,
                        ok: 'Fail'
                    })
                }
            })
            .catch(() => {
                resolve(validateLinkStatus = {
                    href: Link.href,
                    text: Link.text.substr(0, 15),
                    file: Link.file,
                    status: 404,
                    ok: 'Fail'
                })
            })
    });
}

module.exports = {
    DetectPath,
    Status
};
