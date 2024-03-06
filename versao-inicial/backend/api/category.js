module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation          //estamos importando de validation.js
                                                                            //função para salvar categorias
    const save = (req, res) => {                                            //criando nova categoria através da requisição
        const category = { ...req.body }
        if(req.params.id) category.id = req.params.id

        try {
            existsOrError(category.name, 'Nome não informado')             //se colocar o nome ok, agora se não colocar, ele vai gerar a msg de erro
        } catch(msg) {                                                     //se existir o erro ele vai entrar neste cacth, retornando o status e a msg
            return res.status(400).send(msg)                               //lembrando que o return ele retornara a reposta e saira da função ou seja as excessões abaixos ele não passara por elas
        }
        if(category.id) {                                                  //se category estiver com o id setado, eu vou querer fazer um update
            app.db('categories')
            .update(category)                                              //atualizando category
            .where({ id: category.id })                                    //pegando  category por id
            .then(_ => res.status(204).send())                             //a atualização com sucesso gerara o status 204
            .catch(err => res.status(500).send(err))                       //aqui no caso se houver erro

        } else {
            app.db('categories')                                           //se category não estiver com o id setado significa que é uma category nova
            .insert(category)                                              //inserindo a category 
            .then(_ => res.status(204).send())                             //salvando a category com sucesso gerara o status 204
            .catch(err => res.status(500).send(err))                        //aqui é se por acaso der erro
        }
    }                                                                       //aqui são as validações para excluir category, pois tem uma serie de fatores que tem que ser visto antes de remover uma category
    const remove = async (req, res) => {                                    
    try {
        existsOrError(req.params.id, 'Código da Categoria não informado.')  //tem que informar o id, se não dara esse erro

        const subcategory = await app.db('categories')                      //aqui estamos verificando se a category que queremos excluir se ela possui subcategorias, se não existir ok, agora se existir dara erro
        .where({ parentId: req.params.id })
        notExistsOrError(subcategory, 'Categoria possui subcategorias.')
        const articles = await app.db('articles')                           //aqui estamos vendo se category possui artigos associados
        .where({ categoryId: req.params.id })
        notExistsOrError(articles, 'Categoria possui artigos.')             //se não existir artigos ok, agora se existir dara erro
        const rowsDeleted = await app.db('categories')
        .where({ id: req.params.id }).del()                                 //se passar pelas excessões ai poderemos deletar a category
        existsOrError(rowsDeleted, 'Categoria não foi encontrada.')         //se não achar a categoria dara esse erro
        res.status(204).send()                                              //se for deletada com sucesso gerara status 204
    } catch(msg) {                                                          //caso ela der alguns dos erros acima , mostrara a msg de erro e o status 400
        res.status(400).send(msg)
    }
    }
    const withPath = categories => {                                               //estamos recebendo uma lista de categorias
        const getParent = (categories, parentId) => {                               //aqui vamos pegar a categoria pai
            const parent = categories.filter(parent => parent.id === parentId)     //aqui estamos fazendo o filtro para pegar essa categoria pai
            return parent.length ? parent[0] : null                                 //aqui ele retornara o parent, agora se ele não achar o parent ou seja parent igual a 0 ele retornara nulo
        }

        const categoriesWithPath = categories.map(category => {                     //aqui vai pegar um array de categorias e transformar em um de categorias com path, para ver os paths(caminhos) de cada categoria
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while(parent) {                                                         //enquanto existir parent vai concatenando para montar o path(caminho) completo
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }
            return { ...category, path }                                            //retornando a reposta da função
        })
        categoriesWithPath.sort((a, b) => {                                         //ordenando as categorias em ordem alfabetica
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })
        return categoriesWithPath
    }
    const get = (req, res) => {                                                    //metodo get para mostrar do banco de dados a lista de categorias com seus respectivos dados.
        app.db('categories')
        .then(categories => res.json(withPath(categories)))
        .catch(err => res.status(500).send(err))
    }
    const getById = (req, res) => {                                                //aqui é para pegar apenas uma categoria por id, ao invés do get que mostra a lista inteira
        app.db('categories')
        .where({ id: req.params.id })
        .first()
        .then(category => res.json(category))
        .catch(err => res.status(500).send(err))
    }                                                                             //estamos deixando os itens da lista em formato de arvore
    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId)                       //aqui estamos pegando os nós pais
        tree = tree.map(parentNode => {                                             //aqui vamos pegar os nós filhos(os filhos de parentNode)
            const isChild = node => node.parentId == parentNode.id       
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }
        const getTree = (req, res) => {                                            //aqui esta pegando os dados de função acima e vai imprimir os elementos da tabela categories no formato de arvore
            app.db('categories')                                                   //salvando em tabela categories no banco
            .then(categories => res.json(toTree(categories)))                      //aqui ira imprimir o resultado 
            .catch(err => res.status(500).send(err))                               // se der algum erro
        }
                                              
        return { save, remove, get, getById, getTree }                               //retornando os metodos                       
    }
