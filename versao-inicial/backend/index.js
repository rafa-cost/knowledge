const app = require('express')()    
const consign = require('consign')              //fazendo os imports
const db = require('./config/db')
const mongoose = require('mongoose')

require('./config/mongodb')                      //importamos o arquivo mongodb.js

app.db = db                                      //referente ao arquivo db.js que importamos acima, aqui é q vamos usar banco de dados postgres
app.mongoose = mongoose                          //importamos acima , aqui é para usarmos o mongodb no projeto                   

consign()  
.include('./config/passport.js')                 //esses caminhos rodam no terminal quando executamos o comando npm start
.then('./config/middlewares.js')
.then('./api/validation.js')
.then('./api')
.then('./schedule')
.then('./config/routes.js')
.into(app)

app.listen(3000, () => {                         //porta que iremos usar
    console.log('Backend executando...')         //msg que aparecera no terminal ao rodarmos o npm start
})