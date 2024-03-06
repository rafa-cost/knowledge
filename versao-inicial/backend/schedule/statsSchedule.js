const schedule = require('node-schedule')                                                //fazendo o import

//module.exports pelo que eu entendi ele ja importa tudo que esta dentro de app(knowledge) ou seja todos os arquivos dentro de app(knowledge) que usam o "module.exports = app =>" no começo das funções, podem fazer importações de funções entre si, sem precisar declarar no começo do arquivo a importação . Depois vamos olhar a aula 636 para confirmar
module.exports = app => {
    schedule.scheduleJob('*/1 * * * * ', async function () {                              //"'*/1 * * * * '" aqui é para inidcar hora, minuto, dia do mes, dia da semana
        const usersCount = await app.db('users').count('id').first()                      //"app.db('users')"pegando tabela users no banco de dados e "count('id')" contando o numero de id, "first()"começando do primeiro. Ou seja fazendo a contagem dos users e abaixo esta fazendo a contagem de categories e articles
        const categoriesCount = await app.db('categories').count('id').first()
        const articlesCount = await app.db('articles').count('id').first()

        const { Stat } = app.api.stat                                                     //Estamos importando o modelo Stat de stat.js. Passando a rota que definios em routes.js, para usarmos o get e o findOne

        const lastStat = await Stat.findOne({}, {}, { sort: { 'createdAt' : -1 }})        //aqui estamos pegando a ultima stat(estatisca) que esta no mongodb
                                                                                          //passando a contagem que definimos acima, devidamente para cada atributo(users, categories, articles)
        const stat = new Stat({
            users: usersCount.count,                                                     
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date()
        })                                                                               //vamos pegar o lastStat e comparar com stat para ver se houve mudança, estamos fazendo isso na função abaixo
                                                                                         //aqui é para indicar quando users , categories ou articles tiver alguma mudança
        const changeUsers = !lastStat || stat.users !== lastStat.users                   //"!lastStat"se a ultima estatistica não estiver setada. "|| stat.categories !==lastStat.categories" ou valor for diferente, ai eu vou considerar que usuario mudou 
        const changeCategories = !lastStat || stat.categories !==lastStat.categories
        const changeArticles = !lastStat || stat.articles !== lastStat.articles

        if(changeUsers || changeCategories || changeArticles) {                           //a cada mudança em um desses 3 atributos, sera salvo no banco mongodb(stat.save()) e aparecera esta msg no console(terminal onde rodamos o "npm start")
            stat.save().then(() => console.log('[Status] Estatisticas atualizadas'))
        }
    })
}