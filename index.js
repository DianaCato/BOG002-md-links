const DP = require('./api.js');

const ruta = "..\BOG002-data-lovers";
const ruta2 = "../B0G002-cipher";


const mdLinks = (ruta) => DP.DetectPath(ruta);
  

//mdLinks('ruta2');
//console.log(typeof mdLinks);
 module.exports.mdLinks = mdLinks;