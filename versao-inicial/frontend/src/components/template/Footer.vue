<template>
  <div class="footer">
    <span>Copyright <strong>Cod3r</strong> © 2015-2018</span>               <!--texto do rodapé-->
  </div>
</template>

<script>                                                                    //fazendo imports
export default {
  name: "Footer"
}
</script>

<style>
.footer {
    grid-area: footer;                      /*aqui são as grid areas que definimos no app.vue */
    background-color: #DDD;              /*cor de fundo e abaixo é a cor da letra */  
    color: #333;

    display: flex;                          /*usando flex box para organizar o conteudo dentro do footer */
    align-items: center;                    /*alinhamento vertical e abaixo alinhamento horizontal */
    justify-content: flex-end;
    padding-right: 10px;                     /* espaçamento a direita, para o texto do footer não ficar colado a direita da pagina*/
}

</style>