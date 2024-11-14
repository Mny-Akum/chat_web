import axios from "axios"
function login(data){
    return axios.post('/chat/user/login',data)
}
function register(data){
    return axios.post('/chat/user/register',data)
}
function getUserList(){
    return axios.get('/chat/user/list')
}
function getMessageList(params){
    return axios.get('/chat/message/list',{
        params
    })
}
export {
    login,
    register,
    getUserList,
    getMessageList
}