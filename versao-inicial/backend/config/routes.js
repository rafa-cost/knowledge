//cuidado com a ordem das rotas , podem ocasionar erros dependendo da ordem
const admin = require('./admin')                       //estamos importando admin.jst

module.exports = app => {                             //aqui são as rotas que até o momento estamos usando o postman para trabalhar com get, post, put
                                                           //esses 3 primeiros routes não precisam de autenticação para acessalos
   app.post('/signup', app.api.user.save)                  //rota para se inscrever
   app.post('/signin', app.api.auth.signin)                //rota para entrar
   app.post('/validateToken', app.api.auth.validateToken)  //rota para validar o token
   
    app.route('/users')                               //as rotas de users que são post, get
    .all(app.config.passport.authenticate())          //todos os routes que tiver essa linha de código significa que para acessar essas rotas precisa de autenticação. Definimos isso em passport.js
    .post(admin(app.api.user.save))                   //nas rotas que tem o admin no começo, quer dizer que só ele podera acessar. Definimos esse admin em admin.js
    .get(admin(app.api.user.get))

app.route('/users/:id')                               //rota de users/:id (usuarios por id)
.all(app.config.passport.authenticate())                             
.put(admin(app.api.user.save))                               //put ou seja atualizar usuario por id
.get(admin(app.api.user.getById))                             //buscar usuario por id
.delete(admin(app.api.user.remove))                            //deletar usuario por id

app.route('/categories')                               //rotas de categories. Get consultar as categorias, Post salvar novas categorias
.all(app.config.passport.authenticate())
.get(admin(app.api.category.get))
.post(admin(app.api.category.save))


app.route('/categories/tree')
.all(app.config.passport.authenticate())
.get(app.api.category.getTree)

app.route('/categories/:id')                           //categories por id(consultas individuais) as rotas. Get consultar a categoria, Put alterar a categoria, Delete deletar a categoria  
.all(app.config.passport.authenticate())
.get(app.api.category.getById)
.put(admin(app.api.category.save))
.delete(admin(app.api.category.remove))

app.route('/articles')
.all(app.config.passport.authenticate())
.get(admin(app.api.article.get))
.post(admin(app.api.article.save))

app.route('/articles/:id')
.all(app.config.passport.authenticate())
.get(app.api.article.getById)
.put(admin(app.api.article.save))
.delete(admin(app.api.article.remove))

app.route('/categories/:id/articles')
.all(app.config.passport.authenticate())
.get(app.api.article.getByCategory)

app.route('/stats')                             //aqui é referente ao mongodb, o stats é quem busca a informação no mongodb, assim como db busca informação para o postgres
.all(app.config.passport.authenticate())
.get(app.api.stat.get)

}

