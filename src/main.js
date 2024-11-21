import Vue from 'vue'
import router from './router'
import App from './App.vue'
import ElementUI from 'element-ui'
import Axios from "axios"
import store from '@/store'
import mixin from '@/store/mixin'
import 'element-ui/lib/theme-chalk/index.css'
import 'animate.css';
import '@/assets/css/global.css'

Vue.use(ElementUI)
Vue.use(mixin,store)
Vue.config.productionTip = false
Vue.prototype.$axios = Axios
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
