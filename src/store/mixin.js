// src/mixins/chatMixin.js

import { mapState } from 'vuex';
import store from '@/store';

// 获取 Vuex 中的 state 键
let $chatStoreKey = [];
try {
    $chatStoreKey = store.state ? Object.keys(store.state) : [];
} catch (e) {
    console.error('Error while fetching Vuex state keys:', e);
}



export default {
    install(Vue, store) {
        // 挂载到 Vue 原型链，供所有组件使用
        Vue.prototype.$chat = {
            // Vuex 操作方法
            vuex(name, value) {
                store.commit('$chatStore', {
                    name,
                    value,
                });
            },
        },
        Vue.prototype.$chatStore = {
            ...mapState($chatStoreKey)
        }
    },

};

