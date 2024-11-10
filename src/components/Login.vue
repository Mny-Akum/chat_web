<template>
    <div id="loginBox">

        <div class="box">
            <div class="left">
                <div id="settionStyle" @click="setIp">
                    设置ip
                </div>
            </div>
            <transition-group class="right" appear name="animate__animated animate__bounce"
                enter-active-class="animate__flipInX" leave-active-class="animate__flipOutX">
                <div v-if="page == 'login'" key="1">
                    <h4>登 录</h4>
                    <div class="myform">
                        <input class="acc" type="text" v-model="email" placeholder="邮箱">
                        <input class="acc" type="password" v-model="password" placeholder="密码" maxlength="20">
                        <div class="switches">
                            <el-switch v-model="isSave" inactive-color="#e0c3fc" active-color="#8ec5fc"
                                active-text="记住密码" />
                            <el-switch v-model="autoLogin" inactive-color="#e0c3fc" active-color="#8ec5fc"
                                active-text="自动登录" />
                        </div>
                        <button class="submit" style="margin: 3rem auto 0;" @click="login">登录账号</button>
                    </div>

                    <div class="fn">
                        <a @click="changePage('register')">注册账号</a>
                    </div>
                </div>
                <div v-if="page == 'register'" key="2">
                    <h4>注 册</h4>
                    <div class="myform">
                        <!-- 使用label和input的for/id关联，同时保留class以应用样式 -->
                        <input type="text" class="acc" v-model="email" placeholder="邮箱">
                        <div style="width:75%">
                            <input type="text" class="acc" v-model="username" style="width:35%;margin-right:3%"
                                maxlength="20" placeholder="用户名">
                            <input type="password" class="acc" v-model="password" style="width:62%" placeholder="密码"
                                maxlength="20">
                        </div>
                        <!-- 提交按钮，保留class以应用样式 -->
                        <button class="submit" @click="register">一键注册</button>
                    </div>
                    <div class="fn">
                        <a @click="changePage('login')">登录账号</a>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            page: "login",
            email: "",
            username: "",
            password: "",
            showDialog: false,
            ip: '127.0.0.1:5000',
            isSave: false,
            autoLogin: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        setIp() {
            this.$prompt('', '设置IP', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '例如：172.0.0.1:8080',
                inputPattern: /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                inputErrorMessage: 'ip格式有误'
            }).then(({ value }) => {
                this.$message({
                    type: 'success',
                    message: '你的ip是: ' + value,
                });
                this.ip = value
                localStorage.setItem("ip", value)
                axios.defaults.baseURL = 'http://' + this.ip
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        changePage(mode) {
            this.email = ""
            this.username = ""
            this.password = ""
            this.page = mode
            let switchBtnArr = document.getElementsByClassName("el-switch__label");
            this.$nextTick(()=>{
                switchBtnArr[0].style.color = this.isSave ? "#4fa7ff":"#d2a8fa"
                switchBtnArr[1].style.color = this.autoLogin ? "#4fa7ff":"#d2a8fa"
            })

        },
        login() {
            if (!this.check()) {
                return
            }
            axios.post('/chat/user/login', {
                email: this.email,
                password: this.password
            }).then(res => {
                if (res.status == 200) {
                    let data = res.data
                    if (data.code == 1) {
                        this.$message({ type: "success", message: "登录成功" })
                        if (this.isSave) {
                            localStorage.setItem('user', JSON.stringify({ email: this.email, password: this.password }))
                        }
                        this.$router.push({
                            name: "chat",
                            params: { email: this.email },
                        });
                    } else {
                        this.$message({ type: "error", message: data.msg })
                    }
                }
            }).catch(err => {
                console.log(err)
                this.$message({ type: "error", message: "请求错误" })
            })
        },
        register() {
            if (!this.check()) {
                return
            }
            axios.post('/chat/user/register', {
                email: this.email,
                password: this.password,
                username: this.username
            }).then(res => {
                if (res.status == 200) {
                    let data = res.data
                    if (data.code == 1) {
                        this.$message({ type: "success", message: "注册成功" })
                        this.changePage("login")
                    } else {
                        this.$message({ type: "error", message: data.msg })
                    }
                }
            }).catch(err => {
                console.log(err)
                this.$message({ type: "error", message: "请求错误" })
            })
        },
        check() {
            var emailPattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            var bool = emailPattern.test(this.email);
            if (!bool) {
                this.$message({ type: "warning", message: "邮箱有误" })
            }
            else if (!this.username && this.page == "register") {
                this.$message({ type: "warning", message: "请输入用户名" })
                bool = false;
            }
            else if (!this.password) {
                this.$message({ type: "warning", message: "请输入密码" })
                bool = false;
            }
            return bool;
        },
        init() {
            document.title = "欢迎来到App外包工坊"
            document.documentElement.style.fontSize = document.documentElement.clientHeight / 1080 * 12 + 'px'
            this.ip = (this.ip ? this.ip : localStorage.getItem('ip'))
            localStorage.setItem('ip', this.ip)
            axios.defaults.baseURL = 'http://' + this.ip
            axios.defaults.headers.post['Content-Type'] = 'application/json'
        },
        mountedInit() {
            let switchBtnArr = document.getElementsByClassName("el-switch__label");
            switchBtnArr[0].style.color = "#d2a8fa"
            switchBtnArr[1].style.color = "#d2a8fa"
            this.autoLogin = JSON.parse(localStorage.getItem("autoLogin"));
            this.isSave = JSON.parse(localStorage.getItem("isSave"));
            if (this.isSave) {
                let user = JSON.parse(localStorage.getItem("user"));
                this.email = user.email
                this.password = user.password
            }
            if (this.autoLogin) {
                this.login()
            }
        }
    },
    mounted() {
        this.mountedInit();
    },
    watch: {
        isSave(value) {
            let switchBtnArr = document.getElementsByClassName("el-switch__label");
            if (value) {
                switchBtnArr[0].style.color = "#4fa7ff"
            } else {
                this.autoLogin = false
                switchBtnArr[0].style.color = "#d2a8fa"
            }
            localStorage.setItem("isSave", value)

        },
        autoLogin(value) {
            let switchBtnArr = document.getElementsByClassName("el-switch__label");
            if (value) {
                this.isSave = true
                switchBtnArr[1].style.color = "#4fa7ff"
            } else {
                switchBtnArr[1].style.color = "#d2a8fa"
            }
            localStorage.setItem("autoLogin", value)

        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

#loginBox {
    overflow: hidden;
    font-size: 10px;
    height: 100vh;
    background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%) no-repeat;
}

::selection {
    color: #fff;
    background-color: rgb(144, 129, 241);

}

.box {
    display: flex;
    overflow: hidden;
    width: 90rem;
    height: 50rem;
    background-color: rgba(255, 255, 255, 60%);
    border-radius: 1.5rem;
    margin: 10rem auto;
    box-shadow: 0 0 1rem 0.2rem rgb(0 0 0 / 10%);
}

.box .left {
    position: relative;
    width: 35%;
    height: 100%;
    background-color: skyblue;
}

.box .left::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-image: url(@/assets/login/left.png);
    opacity: 80%;
}

.box .right {
    display: flex;
    width: 65%;
    flex-direction: column;
    align-items: center;
}

.box .right h4 {
    text-align: center;
    color: rgb(144, 129, 241);
    font-size: 3rem;
    margin-top: 5rem;
}

.box .right .myform {
    display: flex;
    /* text-align: center; */
    flex-wrap: wrap;
    justify-content: center;
}

.box .right .myform .acc {
    outline: none;
    width: 75%;
    height: 5rem;
    font-size: 1.6rem;
    margin-top: 5rem;
    padding: 1rem 0 0 1.6rem;
    border: none;
    border-bottom: 1px solid rgb(144, 129, 241);
    color: rgb(144, 129, 241);
    background-color: rgba(0, 0, 0, 0);
}

.right .myform .acc:focus {
    outline: none;
    color: rgb(144, 129, 241);
    padding: 1rem 0 0 1.6rem;
}

.right .submit {
    padding: 0 10rem;
    height: 5rem;
    color: #f6f6f6;
    background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
    font-size: 1.4rem;
    border: none;
    border-radius: 0.5rem;
    /* margin: 6rem 0 0 50%; */
    /* transform: translateX(-50%); */
    margin: 6rem auto 0;
}

.right .submit:hover {
    box-shadow: 0 0 2rem -0.5rem rgb(0 0 0 / 15%);
}

.right .fn {
    display: flex;
    margin-top: 1rem;
    width: 70%;
}

.right .fn a {
    font-size: 1.3rem;
    margin-left: 2rem;
    margin-top: 3rem;
    padding: 1rem 2rem;
    color: #666;
}

.right .fn a:hover {
    color: rgb(144, 129, 241);
}

#settionStyle {
    bottom: 3px;
    right: 3px;
    position: absolute;
    padding: 5px 10px;
    color: rgb(144, 129, 241);
}

#settionStyle:hover {
    color: rgb(93, 70, 245);
}

.switches {
    display: flex;
    justify-content: space-around;
    width: 75%;
    margin-top: 2rem;
}
</style>
