import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
{
    path:'/login',
    name:'login',
    component:()=>import('@/view/Login.vue')
},{
    path:'/chat',
    name:'chat',
    component: ()=>import('@/view/Chat.vue')
},
]
let router = new VueRouter({routes})
export default router