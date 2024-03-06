const mongoose = require('mongoose')                                                //fazendo a conexão entre o mongodb e o projeto
mongoose.connect('mongodb://localhost/knowledge_status', {useNewUrlParser: true})
.catch(e => {                                                                        //se der algum erro na conexão entrara aqui
    const msg = 'ERRO! Não foi possível conectar com oo MongoDB!'
    console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')                               //aqui estamos definindo a cor da letra , cor de fundo da msg de erro
})