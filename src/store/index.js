import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
let lifeData = {}
const store = new Vuex.Store({
    mutations:{
        $chatStore(state,payload){
            let nameArr = payload.name.split('.')
            let len = nameArr.length
            if(nameArr.length >= 2){
                let obj = state[nameArr[0]]
                for(let i = 1 ; i < len - 1 ; i++){
                    obj = obj[nameArr[i]];
                }
                obj[nameArr[len - 1]] = payload.value;
            }else{
                state[payload.name] = payload.value;
            }
        }
    },
    state: {
        email: lifeData.email ? lifeData.lifeData : "",
        password: lifeData.password ? lifeData.password : "",
        username: lifeData.username ? lifeData.username : "",
        token: lifeData.token ? lifeData.token : "",
        ip: lifeData.ip ? lifeData.ip : "127.0.0.1:5000",
    }
})
export default store