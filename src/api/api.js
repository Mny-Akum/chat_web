import axios from "axios"
export {
    login,                      //登录
    register,                   //注册
    getUserList,                //获取用户列表
    getUserInfo,                //获取个人信息
    getMessageList,             //获取消息列表
    uploadImage,                //上传图片
    changeAvatar,               //更改头像
}

function login(data){
    return axios.post('/chat/user/login',data)
}
function register(data){
    return axios.post('/chat/user/register',data)
}
function getUserList(){
    return axios.get('/chat/user/list')
}
function getUserInfo(email){
    return axios.get('/chat/user/getInfo',{
        params:{
            email
        }
    })
}
function changeAvatar(data){
    return axios.put('/chat/user/reavatar',data)
}
function getMessageList(params){
    return axios.get('/chat/message/list',{
        params
    })
}
function uploadImage(img){
    const formData = new FormData()
    formData.append('image',img)
    return axios.post("/chat/upload/image",formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
