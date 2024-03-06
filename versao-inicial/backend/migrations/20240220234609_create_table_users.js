
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('name').notNull()
    table.string('email').notNull().unique()                  //email tipo string, notNull(campo obrigatório), unique(campo unico) a informação não pode se repetir
    table.string('password').notNull()
    table.boolean('admin').notNull().defaultTo(false)         //admin do tipo boolean(verdadeiro ou falso), campo obrigatório e começara como falso. Esse campo indicara se o usuario é admin ou não
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users')
  
};
