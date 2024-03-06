//este arquivo pelo que entendi é para configurarmos o mongodb
//stat(estatistica) sera quem buscara as informações no mongodb, assim como db busca informações no postgres
module.exports = app => {                                       //aqui sera nosso modelo no mongodb, aqui pelo que eu entendi o mongodb ira armazenar estes dados e também esta definindo o tipo de cada elemento(users: Number, categories: Number)
    const Stat = app.mongoose.model('Stat', {        
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date                                        //data de criação
    })
                                                                //função de consulta da tabela stats
    const get = (req, res) => {                               
        Stat.findOne({}, {}, { sort: { 'createdAt' : -1 } })    //o Stat que ira buscar no mongodb as atualizações dos dados(users, categories, articles). "findOne" pegando um. 'createdAt' : -1' aqui ele ira pegar a partir do ultimo cadastro
        .then(stat => {
            const defaultStat = {                               //aqui serão os dados que mostraram na consulta, todos começam a partir de zero
                users: 0,
                categories: 0,
                articles: 0
            }
            res.json(stat || defaultStat)                       //caso stat não estiver setado ou seja não recebeu uma informação valida retorne dafaultStat
            })
    }
    return { Stat, get }
}
