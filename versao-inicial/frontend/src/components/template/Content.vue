<template>
  <div class="content"></div>
</template>

<script>
export default {
name: 'Content'
}
</script>

<style>
.content {
    grid-area: content;                               /*aqui são as grid areas que definimos no app.vue */
    background-color: #efefef;                   /*cor de fundo e abaixo é o espaçamento interno */
    padding: 20px;                                    
}
</style>