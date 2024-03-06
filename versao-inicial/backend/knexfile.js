const db = require('./.env')

module.exports = {                             //colocando as configurações de conexão do banco de dados(nome do banco, usuario e senha)
    client: 'postgresql',
    connection: {
      database: 'knowledge',
      user:     'postgres',
      password: '25443800'
    },
    pool: {                                     //pool de conexões no minimo 2 maximo 10
      min: 2,
      max: 10
    },
    migrations: {                              //tabela de migração
      tableName: 'knex_migrations'
    }

};
