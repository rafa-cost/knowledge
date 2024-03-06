module.exports = app => {                                            //para exportar essas 3 funções
                                                                    //essa função é se o valor existir não acontece nada se não existir a função ira lançar uma msg de erro
    function existsOrError(value, msg) {                                  
        if(!value) throw msg                                        //se o valor não estiver setado sera lançado a msg de erro
        if(Array.isArray(value) && value.length === 0) throw msg   //se o array estiver vazio(se a quantidade de caracteres dentro do array for igual a zero)sera lançado a msg de erro
        if(typeof value === 'string' && !value.trim()) throw msg   //string vazia(string com espaços em branco) também sera lançado o erro
    }
                                                                //aqui é uma função que contraria se não existir erro ok, se existir gerara a msg
function notExistsOrError(value, msg) {                            
    try {
        existsOrError(value, msg)                                 //chamando a função existsOrError, ou seja se ele passou pela função tudo certinho , entrara aqui na função e sera lançado a msg
    } catch(msg) {
        return
    }
    throw msg
}
                                                                    //se não for igual gerara o erro
function equalsOrError(valueA, valueB, msg) {
    if(valueA !== valueB) throw msg                                  //se a não é igual a b , lançara a msg
} 
return { existsOrError, notExistsOrError, equalsOrError}              //retornando as 3 funções
}