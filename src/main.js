import Vue from 'vue'
import router from './router'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'animate.css';
import '@/assets/css/global.css'
import axios from "axios"

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
