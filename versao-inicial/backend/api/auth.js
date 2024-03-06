const { authSecret } = require('../.env')                                            //fazendo alguns imports
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
module.exports = app => {                                                           //função para entrar com email e password  
    const signin = async (req, res) => {                                             
        if (!req.body.email || !req.body.password) {                                //se email ou senha estiverem em branco retornara o status 400 e a msg de erro
            return res.status(400).send('Informe usuário e senha')
        }
        const user = await app.db('users')                                          //pegando tabela users(usuarios) do banco de dados
        .where({email: req.body.email })                                            // pelo email de usuario sera comparado com email da requisição   
        .first()
    
        if(!user) return res.status(400).send('Usuário não encontrado!')           //se usuario for diferente(verificação feita pelo email) , retornara o status 400 e a msg de erro

        const isMatch = bcrypt.compareSync(req.body.password, user.password)       //comparando a requisição password, com user password para ver se são iguais
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!')        //se não corresponder retornara o status 401 e a msg de erro
        const now = Math.floor(Date.now() / 1000)                                  //aqui irar gerar os numeros de iat e exp, na const abaixo
        const payload = {                                                          //aqui sera o resultado da requisição Post, serão esses dados abaixos para o usuario
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,                                                               //data de emissão, significa emitido hein ou seja significa a data em que o token foi emitido
            exp: now + (60 * 60 * 24 * 3)                                           //data de expiração ,esse token tera validade de 3 dias, por o 3 no final

        }                                                                          //o token sera gerado pelo jwt e palo authSecret. Fizemos o import dos 2 acima
        res.json({                                                                //aqui sera a resposta da requisição Post com a const payLoad + o token
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }                                                                      //aqui sera a verificação do token, para ver se ele é valido e também se ele não esta expirado
    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)     //verificando a autencidade do token
                if(new Date(token.exp * 1000) > new Date()) {            //verificando se o token esta expirado
                    return res.send(true)                                //retornando token valido
                }
            }
        } catch(e) {                                                      //se o token não for valido retornara res.send(false)
            //problema com token
        }
        res.send(false)
    }
return { signin, validateToken }

}