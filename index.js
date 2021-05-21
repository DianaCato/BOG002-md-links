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
    (path) ? DP.DetectPath(path).then(res => {
      switch (true) {
        case (options.validate == false):
          resolve(res)
          break;
        case (options.validate && !Array.isArray(res[0]) && typeof res != 'string'):
          const ValidadorLinks = [];  
          res.forEach(obj =>{
            ValidadorLinks.push(DP.Status(obj))
          })
          Promise.all(ValidadorLinks).then(r => resolve(r))
          break;
        case (options.validate && Array.isArray(res[0])):
          const arrayValidate = []; 
          res.forEach(element => {
            if (typeof element == 'object') {
             
              element.forEach(el => {
                arrayValidate.push(DP.Status(el))
              })
            }
          })
          Promise.all(arrayValidate).then(r => resolve(r));
          break;
        default:
          resolve(res)
      }
    })
      .catch(err => reject(err))
      : reject(new Error('No ingreso ninguna ruta'))
  })
}

module.exports.mdLinks = mdLinks;
