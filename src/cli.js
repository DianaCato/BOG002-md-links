#! / usr / bin / env node
const mdLinks = require('./index.js');
const chalk = require('chalk');
const Stats = require('./stats.js');

const wellcome = msn => {
    console.log(chalk.bold.cyan(msn));
}

(async () => {
  wellcome(`   *****************************************************************
                            Wellcome Md-Links
   *****************************************************************`);
})();

const input = process.argv;
const path = input[2];
const validate = input.includes("--validate");
const stats = input.includes("--stats"); 
const help = input.includes("--help");

const cli = (path, options) => {
    const {validate, stats} = options

    if (validate && stats){
        return mdLinks.mdLinks(path, {validate: true})
        .then((result) => {
            console.log(chalk.bold.magenta(` Total: ${Stats.getStats(result).total}`))
            console.log(chalk.bold.magenta(` Unique: ${Stats.getStats(result).unique}`))
            console.log(chalk.bold.magenta(` Broken: ${Stats.getStats(result).broken}`))
        })

    } if(validate) {
        return mdLinks.mdLinks(path, {validate: true})
        .then((result) => {
            const data = [];
           result.forEach(element =>{
              data.push([element.file, element.href, element.ok, element.status, element.text])
            })
            console.table(data);
        })
        .catch(console.error)

    } if (stats){
        return mdLinks.mdLinks(path, {validate: false})
        .then((result) => {
            console.log(chalk.bold.magenta(` Total: ${Stats.Stats(result).total}`))
            console.log(chalk.bold.magenta(` Unique: ${Stats.Stats(result).unique}`))
        })
        
    } if (help){
            console.log(chalk.bold.magenta(`
            -------------------------------------------HELP-----------------------------------------
            | --validate         | 'Valida el estado del link'                                     |
            | --stats            | 'Muestra las estadísticas de los links'                         |
            | --stats --validate | 'Realiza la validación y muestra las estadística de los links'  |
            ----------------------------------------------------------------------------------------
            `));

    }else {
        return mdLinks.mdLinks(path, {validate: false})
        .then((result) => {
                result.forEach(element => {
                    console.log(chalk.green(element.file),chalk.gray(element.href), chalk.magenta(element.text))
                });
        })
        .catch(e => console.log(chalk.bgRed(e.message)))
    }
}

cli(path, {validate: validate, stats, help});


