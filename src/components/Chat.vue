<template>
  <div class="main">
    <div id="box">
      <div class="app">
        <suspensionBall />
      </div>
      <main id="left">
        <ul>
          <div>群组聊天( 当前人数：{{ userCount }} )</div>
          <li @click="choiceUser()">群组聊天</li>
        </ul>
        <ul>
          <div>用户列表：</div>
          <li :class="item.online ? 'isLine' : 'notLine'" v-for="(item, index) in userlist" :key="index"
            @click="choiceUser(item)">{{ item.username }}</li>
        </ul>
      </main>
      <div id="right">
        <div id="chatHeader">{{ chatUser.username }}</div>
        <el-main id="chatBody">
          <div v-for="(item, index) in messageList[chatUser.email]" :key="index">
            <div style="text-align:center;margin:2rem 0 " v-if="item.showTime">{{ item.time }}</div>
            <div :class="item.from == username ? 'comment-box-we' : 'comment-box-other'">
              <div class="comment-username" v-if="item.type == 'group'">{{ emailMap[item.from] }}</div>
              <div class="comment-container">
                <div class="comment" v-html="item.message"></div>
              </div>
            </div>
          </div>
        </el-main>
        <div id="chatFooter" @keypress="keypressFun">
          <el-input id="areaMsg" type="textarea" :rows="2" placeholder="请输入内容" v-model="sendMessage">
          </el-input>
          <el-button type="primary" id="sendBtn" @click="send">发送消息</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
let socket;
import suspensionBall from './suspension.vue';
export default {
  name: 'app',
  components: {
    suspensionBall
  },
  data() {
    return {
      ip: "",
      sendMessage: "",
      chatUser: {
        username: "群组聊天",
        email: "group"
      },
      userlist: [],
      emailMap: {},
      messageList: {},
      username: "",
      isCollapse: false,
      userCount: 0,
      justTime: {}
    }
  },
  mounted() {
    document.title = "聊天室"
    this.username = this.$route.params.email
    this.ip = localStorage.getItem("ip")
    if (!this.username) {
      this.$message({ type: "warning", message: "暂未登录，请重新登录" })
      this.$router.push("/login")
    }
    this.init()
    this.note()
  },
  computed: {
    //是否显示时间

  },
  methods: {
    /**
     * ["username","username"]
     * [{username,email,isLogin},{},{}]
     * 用于将邮箱映射为名字，获取用户列表
     */
    getUserList(webList) {
      let onlineUser = new Set()
      webList.forEach(item => {
        onlineUser.add(item.username)
      })
      axios.get("/chat/user/list").then(res => {
        let arr = res.data.data
        let reLogin = false;
        let map = {};
        arr.forEach((item) => {
          delete item.password
          map[item.email] = item.username
          item.online = onlineUser.has(item.email)
          if (item.email == this.username) {
            reLogin = true
          }
        })
        if (!reLogin) {
          this.$router.replace("/login")
        }
        //邮箱映射表
        this.emailMap = map
        this.userlist = arr
      })
    },
    //发送消息直接到底部
    scrollFun(type) {
      let scrollHeight1 = chatBody.scrollHeight
      let scrollTop1 = chatBody.scrollTop
      let height = chatBody.clientHeight
      if (type == "send") {
        this.$nextTick(() => {
          chatBody.scrollBy(0, chatBody.scrollHeight)
        })
      } else {
        this.$nextTick(() => {
          let scrollHeight2 = chatBody.scrollHeight
          if (scrollHeight1 - scrollTop1 <= height) {
            chatBody.scrollBy(0, scrollHeight2)
          }
        })
      }
    },
    //ctrl+enter发送消息
    keypressFun(event) {
      if (event.ctrlKey && event.code == "Enter") {
        this.send()
      }
    },
    //是否显示时间
    showTime(name) {
      let obj = { ...this.justTime }
      let nowTime = new Date().getTime() / 1000
      let bool = (nowTime - (this.justTime[name] ? this.justTime[name] : 0) > 1200)
      obj[name] = nowTime
      this.justTime = obj
      return bool
    },
    //选择用户
    choiceUser(item) {
      this.sendMessage = ""
      if (item) {
        this.chatUser = { username: item.username, email: item.email }
      } else {
        this.chatUser = { username: "群组聊天", email: "group" }
      }
    },
    //发送消息
    send() {
      if (!this.chatUser.email) {
        this.$message({ type: 'warning', message: "请选择聊天对象" })
        return;
      }
      if (!this.sendMessage) {
        this.$message({ type: 'warning', message: "请输入内容" })
        return;
      }
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        let message;
        let to;
        if (this.chatUser.email == "group") {
          to = "group"
          message = {
            type: "group",
            message: this.sendMessage
          }
        } else {
          to = this.chatUser.email
          message = {
            type: "single",
            to: this.chatUser.email,
            message: this.sendMessage
          }
        }
        let showTime = this.showTime(to);
        socket.send(JSON.stringify(message));
        let h = new Date();
        let time = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, 0)}-${String(h.getDate()).padStart(2, 0)} ${String(h.getHours()).padStart(2, 0)}:${String(h.getMinutes()).padStart(2, 0)}`
        // let nowTime = new Date().getTime()/1000
        // let showTime = nowTime - this.justTime[to]?this.justTime[to]:0 > 1200
        // this.justTime[to] = nowTime
        if (!this.messageList[to]) {
          let map = { ...this.messageList }
          map[to] = [{ from: this.username, time, message: this.sendMessage, showTime, type: message.type }]
          this.messageList = map
        } else {
          this.messageList[to].push({ from: this.username, time, message: this.sendMessage, showTime, type: message.type })
        }
        this.sendMessage = '';
      }
      this.scrollFun("send")
    },
    //初始化，进行websocket的链接
    init() {
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        let socketUrl = "ws://" + this.ip + "/chat/server/" + this.username;
        if (socket != null) {
          socket.close();
          socket = null;
        }
        // 开启一个websocket服务
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
        };
        //  浏览器端收消息，获得从服务端发送过来的文本消息
        socket.onmessage = (msg) => {
          var data = JSON.parse(msg.data);
          if (data.type == "system") {
            this.getUserList(data.users)
            this.userCount = data.count
          } else {
            //获取当前时间，用于时间显示
            // let nowTime = new Date().getTime()/1000
            // this.justTime = nowTime
            if (data.type == "group") {
              let showTime = this.showTime('group');
              // data['showTime'] = showTime
              if (!this.messageList.group) {
                let map = { ...this.messageList }
                map.group = [data]
                this.messageList = map
              } else {
                this.messageList.group.push(data)
              }
            } else {
              let showTime = this.showTime(data.from);
              // data['showTime'] = showTime
              if (!this.messageList[data.from]) {
                let map = { ...this.messageList }
                map[data.from] = [data]
                this.messageList = map
              } else {
                this.messageList[data.from].push(data)
              }
            }
            this.scrollFun()
          }
        };
        //关闭事件
        socket.onclose = function () {
        };
        //发生了错误事件
        socket.onerror = function () {
        }
      }
    },
    note() {
      (function () {
        var a_idx = 0;
        window.onclick = function (event) {
          var a = new Array("Tomorin","Ano酱","圣青木","Soyorin","Rikki");

          var heart = document.createElement("b"); //创建b元素
          heart.onselectstart = new Function('event.returnValue=false'); //防止拖动

          document.body.appendChild(heart).innerHTML = a[a_idx]; //将b元素添加到页面上
          a_idx = (a_idx + 1) % a.length;
          heart.style.cssText = "position: fixed;left:-100%;"; //给p元素设置样式

          var f = 10, // 字体大小
            x = event.clientX - f / 2, // 横坐标
            y = event.clientY - f, // 纵坐标
            c = randomColor(), // 随机颜色
            a = 1, // 透明度
            s = 1.2; // 放大缩小

          var timer = setInterval(function () { //添加定时器
            if (a <= 0) {
              document.body.removeChild(heart);
              clearInterval(timer);
            } else {
              heart.style.cssText = "font-size:10px;cursor: default;position: fixed;color:" +
                c + ";left:" + x + "px;top:" + y + "px;opacity:" + a + ";transform:scale(" +
                s + ");";

              y--;
              a -= 0.016;
              s += 0.002;
            }
          }, 15)

        }
        // 随机颜色
        function randomColor() {

          return "rgb(" + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + "," + (~~(Math
            .random() * 255)) + ")";

        }
      }());
    }

  }
}
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
}

.mian {
  width: 100%;
  height: 100%;
  /* background-image: url('../assets/images/01.jpg'); */
}

#box {
  /* background: linear-gradient(215deg, #fdaeae, #ffe6c6); */
  background-image: url(../assets/images/01.jpg);
  background-size: cover;
  display: flex;
  height: 100vh;
  width: 100%;
}

#left {
  /* background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%); */
  width: 20%;
  padding: 2.5rem;
  font-size: 1.2rem;
  /* 亚卡力效果 */
  backdrop-filter: blur(10px);
}

#left ul li {
  margin: 0.6rem;
  padding: 0.25rem 1rem;
  /* display: inline-block; */

}

.isLine {
  color: black;
}

.notLine {
  color: #666;
}

#left ul li:hover {
  background: rgba(55, 55, 55, 0.1);
}

ul {
  list-style: none;
}

#right {
  width: 80%;
}

#chatHeader {
  height: 6vh;
  text-align: center;
  font-size: 2.3rem;
  /* background: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7)); */

  /* box-shadow: 0 0.3rem 0.5rem rgba(255, 255, 255, 1); */
  line-height: 6vh;
  backdrop-filter: blur(5rem);
  color: #fc6b6b;
}

#chatFooter {
  background: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7));
  box-shadow: 0rem -0.3rem 0.5rem rgba(255, 255, 255, 1);
  height: 25vh;
}

#areaMsg {
  box-sizing: border-box;
  padding: 2rem;
  height: 20vh;
  font-size: 2rem;
  width: 100%;
  resize: none;
  border: 0rem;
  background: transparent;
  outline: none;
}

#sendBtn {
  float: right;
  height: 3.2rem;
  padding: 1.1rem 2rem 0.9rem;
  font-size: 1.2rem;
  margin-top: 0.5vh;
  margin-right: 1.8rem;
}

#chatBody {
  height: 67vh;
  margin-top: 1vh;
  margin-bottom: 1vh;
  overflow-x: hidden;
}

.comment-container {
  /* 可选：设置一个最大宽度以防止内容过多时元素过宽 */
  box-sizing: border-box;
  margin-bottom: 1rem;
  /* 确保内边距和边框不会增加元素的外部尺寸 */

}

.comment-box-other .comment-container {
  max-width: 100%;
  text-align: left;

}

.comment-box-we .comment-container {
  width: 100%;
  text-align: right;
}


.comment-username {
  /* width: 150px; */
  margin-bottom: 0.3rem;
  margin-top: 1rem;
  /* 添加底部外边距以分隔评论数据和评论内容 */
  /* padding: 0 10px; */
  /* 可选：添加内边距以增加可读性 */
  box-sizing: border-box;
  /* 确保内边距不会增加元素的外部宽度 */
  font-size: 1rem;
  color: #666;
  /* margin-left: 280px; */
}

.comment-box-other .comment-username {
  text-align: left;
}

.comment-box-we .comment-username {
  text-align: right;
}

.comment {
  display: table;
  border-radius: 0.5rem;
  padding: 1rem;
  box-sizing: border-box;
  white-space: pre-wrap;
  /* 保留换行符 */
  word-wrap: break-word;
  /* 防止长单词或URL破坏布局 */
  font-size: 1.2rem;
  max-width: 90%;
  display: inline-block;
  position: relative;
  text-align: left;
}

.comment-box-other .comment {
  background: #f89999;
}

/* 我方发送消息时的气泡效果 部分 */
.comment-box-we .comment {
  background: #8ec5fc;
}

/* 可选：为.comment添加一些阴影以增加视觉深度 */
/**
  other为其他人的消息
  we为自己发送的消息
*/
.comment:after {
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  top: 0.2rem;
  /* 将 right 改为 left，并设置偏移量 */
  border: solid 0.8rem;
  /* 修改边框颜色顺序 */
  font-size: 0;
}

.comment-box-other .comment:after {
  left: -1.4rem;
  border-color: transparent #f89999 transparent transparent;
}

.comment-box-we .comment:after {
  right: -1.4rem;
  border-color: transparent transparent transparent #8ec5fc;
}
</style>
