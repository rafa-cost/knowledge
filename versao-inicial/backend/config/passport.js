//aqui estamos fazendo a logica para que o usuario se log para acessar o conteudo do site
const { authSecret } = require('../.env')                               //fazendo os imports
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {                                               
    const params = {                                                    
        secretOrKey: authSecret,                                       //definimos esse authSecret em ".env"
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()       //extraindo o token do cabeçalho da requisição e vai passar para chave jwtFromRequest
    }
                                                                      //payload definimos em auth.js
    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false))  //se user tiver setado(tiver o id setado) eu vou retornar payload se não tiver , vou retornar false
            .catch(err => done(err, false))                           //aqui é se der erro
    })

    passport.use(strategy)                                            //ele vai usar essa estrategia para aplicar 

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}