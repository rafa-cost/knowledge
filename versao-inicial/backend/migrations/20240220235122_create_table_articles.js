
exports.up = function(knex, Promise) {
    return knex.schema.createTable('articles', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('description', 1000).notNull()                                        //campo descrição tera 1000 caracteres
        table.string('imageUrl', 1000)                                                     //aqui sera a imagem que apontara para o artigo
        table.binary('content').notNull()                                                  //aqui sera o conteudo do artigo
        table.integer('userId').references('id').inTable('users').notNull()                //o campo userId referencia id de tabela users
        table.integer('categoryId').references('id').inTable('categories').notNull()
      })

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('articles')
  
};
