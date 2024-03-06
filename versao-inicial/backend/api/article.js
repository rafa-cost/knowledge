const queries = require('./queries')                                           //fazendo import

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {                                              //função salvar artigo
        const article = { ...req.body }                                       //requisição body(corpo)
        if(req.params.id) article.id = req.params.id                          
        
        try {                                                                 //fazendo as tratativas de erro, caso algum campo de artigo não seja preenchido
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Categoria não informada')
        } catch(msg) {                                                       //aqui pegara a msg de erro 
            res.status(400).send(msg)                                        //aqui gerara o status 400 e a msg de erro
        }
        if(article.id) {                                                     //se artigo tiver id setado, iremos fazer a atualização
            app.db('articles')                                               //tabela articles no banco de dados
            .update(article)                                                 //atualizando o artigo
            .where( { id: article.id })                                      //fazendo o where para ver se estamos alterando o artigo(por id) certo             
            .then(_ => res.status(204).send())                               //se a atualização der certo aprecera o status 204
            .catch(err => res.status(500).send(err))                          //se não aparecera status 500 error
        } else {                                                             //se o id não estiver setado , significa que é um artigo novo , para ser salvo no banco
            app.db('articles')                               
            .insert(article)                                                  //inserindo artigo
            .then(_ => res.status(204).send())                                 //se tudo der certo aparecera o status 204
            .catch(err => res.status(500).send(err))
        }
    }                                                                          //função para remover o artigo
    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('articles')                        //deletando linhas
            .where({ id: req.params.id }).del()
           
           try {                                                              //esceções na hora de deletar 
            existsOrError(rowsDeleted, 'Artigo não foi encontrado.')          //se o artigo existir ok, agora se não existir gerara essa msg de erro
            res.status(204).send()                                            //se o aquivo for deletado com sucesso aparecera o status 204
        } catch(msg) {                                                        //se não , pegara a msg de erro
            return res.status(400).send(msg)                                  //aparecera o status 400 e a msg de erro
        }
        res.status(204).send()                                                 //se o aquivo for deletado com sucesso aparecera o status 204
    } catch(msg) {                                                            //se não , pegara a msg de erro
        res.status(500).send(msg)                                              //aparecera o status 500 e a msg de erro
    }
    }
    const limit = 10                                                          //usando para paginação, aqui no caso aparecera 10 elementos em cada pagina.
    const get = async (req, res) => {                                         //metodo get , para consultar a tabela article
        const page = req.query.page || 1                                      //se não vier nenhuma requisição da query , sera exibido a pagina 1. Pelo que eu entendi na parte de paginação escolhemos a pagina que é de 1 em diante , se não escolhermos nenhuma sera exibida a pagina 1

        const result = await app.db('articles').count('id').first()           //aqui pelo que eu entendi ele vai dividir a quantidade de elementos por pagina, começo acima defimos 10 elementos por pagina, se tiver 100 elementos serão 10 pagina cada uma com 10 elementos, ele fara esse contagem de acordo a quantidade de elementos que temos com a quantidade limite de elementos por pagina(10) e fara essa divisão dos elementos por paginas. O "count" fara isso. O "first" pegara o primeiro elemento 
        const count = parseInt(result.count)                                  //aqui estamos pegando o resultado da função acima(result) ele vem em formato de string e estamos transformando em inteiro(parseint)

        app.db('articles')                                                    //tabela article do banco de dados
        .select('id', 'name', 'description')                                  //selecionando os atributos de cada artigo
        .limit(limit).offset(page * limit - limit)                            //aqui vai ser um calculo em cima do limit e em cima do page, tem a ver com o limite de paginas que definimos acima (10). Acho que vai dividir o conteudo nas paginas de acordo com o limite de elementos estabelecido que é 10, de acordo com a quantidade de elementos que temos supondo se for 100 elementos , sera 10 paginas com 10 elementos cada, tem a ver com a contagem dos elementos das paginas ou seja a primeira pagina sera de 1 a 10 a segunda de 2 a 20 a terceira de 3 a 30 e dai por diante
        .then(articles => res.json({ data:articles, count, limit }))          //aqui além na consulta , além de vir os artigos(article) vira junto o count e o limit
        .catch(err => res.status(500).send(err))
    }
    const getById = (req, res) => {                                          //fazendo a consulta na tabela article por id
        app.db('articles')                                                    //tabela article do banco de dados
        .where({ id: req.params.id })                                         //consultado por id
        .first()                                                              //apenas a primeira, pegando apenas um resultado
        .then(article => {                                                    //retornando a resposta
            article.content = article.content.toString()                      //o arquivo vem em formato binario , ai covertemos ele para string
            return res.json(article)
        })
        .catch(err => res.status(500).send(err))                              //se der erro
    }                                                                         //função pegar por categoria
    const getByCategory = async (req, res) => {
        const categoryId = req.params.id                                                 //id das categorias pai .Requisição por parametro id
        const page = req.query.page || 1                                                 //se não receber nenhum numero de consulta de paginação, paginação partira de numero 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)    //id das categorias filha
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'articles', u: 'users'})                                             //indicando que a = articles(tabela) e u = users(tabela). O apelido da tabela(alias)
        .select('a.id', 'a.name', 'a.description', 'a.imageUrl', {author: 'u.name' })   //quando fizer a consulta getByCategory irão aparecer esses parametros de cada categoria
        .limit(limit).offset(page * limit - limit)                                      //aqui vai ser um calculo em cima do limit e em cima do page, tem a ver com o limite de paginas que definimos acima (10). Acho que vai dividir o conteudo nas paginas de acordo com o limite de elementos estabelecido que é 10, de acordo com a quantidade de elementos que temos supondo se for 100 elementos , sera 10 paginas com 10 elementos cada, tem a ver com a contagem dos elementos das paginas ou seja a primeira pagina sera de 1 a 10 a segunda de 2 a 20 a terceira de 3 a 30 e dai por diante
        .whereRaw('?? = ??', ['u.id', 'a.userId'])                                       //igualando as tabelas(articles e users)
        .whereIn('categoryId', ids)
        .orderBy('a.id', 'desc')                                                         //fazer consulta em ordem decrescente, dos mais novos para os mais antigos
        .then(articles => res.json(articles))                                           //gerando a resposta do metodo getByCategory
        .catch(err => res.status(500).send(err))                                        //se der erro
    }         
    
    return { save, remove, get, getById, getByCategory }                                     //retornando as funções para registrar
}