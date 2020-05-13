import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import store from './store'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import About from './components/about.vue'
import HelloWorld from './components/HelloWorld.vue'

Vue.use(Buefy, {
    defaultIconPack: 'fas',
    defaultContainerElement: '#content',
})
Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/about', component: About }
]

const router = new VueRouter({
  routes
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
