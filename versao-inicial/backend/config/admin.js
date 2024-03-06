//aqui estamos configurando o admin, ou seja só o admin podera fazer certas alterações no site, estamos definindo isso no routes.js
module.exports = middleware => {                                      //estamos passando um middleware como parametro dentro da função que retornara como resposta (req, res, next)
    return (req, res, next) => {
        if(req.user.admin) {                                         //se o usuario for o administrador eu vou chamar o middleware com a req, res, next
            middleware(req, res, next)
        } else {                                                     //se não for o admin dara esse erro abaixo
            res.status(401).send('Usuário não é administrador.')
        }
    }
}