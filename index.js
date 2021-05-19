const DP = require('./api.js');

/**
 * Retorna una promesa que se resuleve en un array de objetos con la data de los links.
 *
 * @param {string} path Ruta del archivo o carpeta.
 * @param {boolean} options Ingrese { validate: true } para hacer validación de links.
 * @returns {Promise} 
 */

function mdLinks(path, options = { validate: false }) {
  return new Promise(function (resolve, reject) {
    switch (options.validate) {
      case false:
        (path) ? DP.DetectPath(path).then(res=> resolve (res))
        .catch(err => reject(err)) 
        : reject(new Error('No ingreso ninguna ruta'))
        break;
      case true:
        resolve('si quiere validar')
        break;
    }
  })
}

module.exports.mdLinks = mdLinks;