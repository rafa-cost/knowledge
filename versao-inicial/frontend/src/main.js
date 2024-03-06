import 'font-awesome/css/font-awesome.css'         //importando o icone(setinha)
import Vue from 'vue'                               //fazendo importações

import App from './App'
import './config/bootstrap'
import store from './config/store'

Vue.config.productionTip = false

new Vue({
  store,                                          //usando o store que importamos
  render: h => h(App)
}).$mount('#app')