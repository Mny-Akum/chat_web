import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
{
    path:'/login',
    name:'login',
    component:()=>import('@/components/Login.vue')
},{
    path:'/chat',
    name:'chat',
    component: ()=>import('@/components/Chat.vue')
}
]
let router = new VueRouter({routes})
export default router