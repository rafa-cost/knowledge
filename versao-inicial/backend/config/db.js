const config = require('../knexfile.js')                //importando as configurações do banco
const knex = require('knex')(config)                    //instanciando o knex , passando o arquivo de cofiguração para ele

knex.migrate.latest(config)                             //aqui ele vai executar a migração no momento em que eu rodar no meu backend npm start
module.exports = knex                                   //para esportar esse arquivo, para gente usar no arquivo index.js