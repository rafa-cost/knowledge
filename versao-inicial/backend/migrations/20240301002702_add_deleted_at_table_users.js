//criamos essa migration com os comandos "knex migrate:make add_deleted_at_table_users", configuramos o arquivo abaixo e depois rodamos o comando abaixo para criar a coluna na tabela 
//rodamos o comando "knex migrate:latest" para criar a coluna "deletedAt" na tabela users
//tudo que eu faço no up eu desfaço do down
exports.up = function(knex, Promise) {                      //alterar tabela criando uma coluna
    return knex.schema.alterTable('users', table => {
        table.timestamp('deletedAt')                        //criando um campo de data tempo
    })
  
};

exports.down = function(knex, Promise) {                   //alterar tabela excluindo uma coluna
    return knex.schema.alterTable('users', table => {
        table.dropColumn('deletedAt')
    })
  
};
