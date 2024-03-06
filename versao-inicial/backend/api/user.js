const bcrypt = require('bcrypt-nodejs')                                              //fazendo o import aqui , esse import é referente a senha(password) para criptografar a senha do usuario

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation    //funções que importamos de validation.js e vamos usalas abaixo
    const encryptPassword = password => {                                            //função de gerar a senha
        const salt = bcrypt.genSaltSync(10)                                          
        return bcrypt.hashSync(password, salt)
    }
    const save = async (req, res) => {                                               //função para salvar usuario, essa função também sera para alterar usuario
        const user = { ...req.body }                                                 //aqui estamos criando um novo usuario a partir da requisição
        if(req.params.id) user.id = req.params.id
                                                                                    //essas 2 linhas abaixo é para que o usuario quando for se cadastrar através do signup, não se cadastrar como admin. Só quem vai ter esse poder é um usuario admin cadastrar outro usuario como admin
        if(!req.originalUrl.startsWith('/users')) user.admin = false                //requisição de criação de novo usuario, tera o atributo admin como false. Ou seja o usuario que acabamos de criar na linha 10 e 11 tera o atributo admin como false.
        if(!req.user || !req.user.admin) user.admin = false                          //não tem usuario logado e não tem administrador, obrigatoriamente user.admin sera false. Aqui é o seguinte dentro do programa tem um usuario logado, mas esse usuario não é admin então esse usuario por não ser admin ele não consegue cadastrar um novo usuario como admin.

        try {
            existsOrError(user.name, 'Nome não informado')                             //função existsOrError ou seja se não preencher os campos de name , email, password, confirmPassword. Essa função dara as msgs de erro dependendo de qual campo não foi preenchido 
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')  //essa função equalsOrError, ira comparar se as do password e confirmPassword são iguais , se não for dara erro e mostrara a msg

            const userFromDB = await app.db('users')                                   //aqui é uma função que ira ver na hora do cadastro se o email é repetido  
            .where({ email: user.email }).first()
            if(!user.id) {                                                              //se o id não for informado precisaremos abortar esta seção, pelo que eu entendi esse id tem a ver a questão de atualizar o usuario
                notExistsOrError(userFromDB, 'Usuaŕio já cadastrado')                  //aqui é senão existir o erro ele vai passar se existir ele ira mostrar a msg
            }
        } catch(msg) {                                                                 //aqui ele pegara a msg(se existir erro) e retornara o status 400 junto com a msg. Qualquer erro que der dentro do try
            return res.status(400).send(msg)
        }
        user.password = encryptPassword(user.password)                                  //se ele passar por todas as confirmações(ou seja se não tiver erro) ele ira salvar a senha para usuario no banco de dados
        delete user.confirmPassword                                                      //e ira deletar o confirmPassword , pois isso só serve para o cadastro

        if(user.id) {                                                                   //aqui se o id estiver setado , sera a forma de como atualizar algum dado usurio 
            app.db('users')
            .update(user)
            .where({ id: user.id })
            .whereNull('deletedAt')                                                    //o usuario que estiver deletado virtualmente não podera ser atualizado
            .then(_=> res.status(204).send())                                           //se tudo der certo retornara o status 400
            .catch(err => res.status(500).send(err))                                   //o pode ser que de algum erro do servidor de status 500 
        } else {                                                                       //caso o id não estiver setado iremos entrar aqui. Ou seja se não tiver o id é pq é um usuario novo. E abaixo é a forma de cadastro do usuario novo
            app.db('users')
            .insert(user)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }                                                                                  //metodo get ele ira mostrar os usuarios que estão salvos dentro do banco de dados, tabela users 
    const get = (req, res) => {                                                         //ele mostrara os dados de cada usuario (id, name, email, admin) 
        app.db('users')
        .select('id', 'name', 'email', 'admin')
        .whereNull('deletedAt')                                                          //o usuario que estiver deletado virtualmente , não aparecera na consulta get
        .then(users => res.json(users))                                                 //se tudo der certo ele retornara aqui, caso contrario entrara no catch que é o erro
        .catch(err => res.status(500).send(err))
    }
    const getById = (req, res) => {                                                     //buscar usuario por id, bem parecido com a função acima . Mas com a diferença de em vez mostrar todos usuarios da lista, ira mostrar apenas o usuario buscado por id               
        app.db('users')
        .select('id', 'name', 'email', 'admin')
        .where({ id: req.params.id })                                                   //buscando o usuario por id
        .whereNull('deletedAt')                                                          //o usuario que estiver deletado virtualmente , não aparecera na consulta getById                                                                          
        .first()                                                                        
        .then(user => res.json(user))                                                    //buscando apenas um usuario         
        .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {                                                        //aqui é a questão de remover usuario que possui articles(artigos) vinculado
            const articles = await app.db('articles')                //tabela articles do banco de dados     
            .where({ userId: req.params.id })                        //comparando o userid com o da requisição (req.params.id), vendo pelo id se possui articles
            notExistsOrError(articles, 'Usuário possui artigos.')    //se não existir artigos vinculado ok , agora se existir dara essa msg de erro

            const rowsUpdate = await app.db('users')                  //aqui é a questão que se os dados da requisição não bater com nenhum usuario cadastrado dentro de tabela users , dara esse erro abaixo 
            .update({deletedAt: new Date()})                         
            .where({ id: req.params.id })
            existsOrError(rowsUpdate, 'Usuário não foi encontrado.')

            res.status(204).send()                                  //se passar pelas 2 excessões mostrara o status 204
        } catch(msg) {                                              //agora se der algum dos 2 erros , mostrara o status 400 + a msg de erro
            res.status(400).send(msg)
        }
    }
    return { save, get, getById, remove }
}