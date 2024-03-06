
exports.up = function(knex, Promise) {
    return knex.schema.createTable('categories', table => {
        table.increments('id').primary()
        table.string('name').notNull()                         //name do tipo string, notNUll(não nulo) ou seja campo obrigatório
        table.integer('parentId').references('id')             //aqui é um auto relacionamento, aqui é uma coluna que se relaciona com a propria tabela. Referencia o campo id da tabela categories
        .inTable('categories')
      })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categories')
};
