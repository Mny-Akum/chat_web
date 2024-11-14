<template>
  <div class="main">
    <div id="box">
      <div class="app">
        <MyCat />
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
        <!-- 显示当前对话的用户 -->
        <div id="chatHeader">{{ chatUser.username }}</div>
        <!-- 消息列表 -->
        <el-main id="chatBody" ref="chatBody" @onscroll="messageLazyLoad">
          <chat-loading :isLoading="messageList.isLoading" text="消息正在赶来喵~" />
          <div v-for="(item, index) in messageList[chatUser.email]" :key="index">
            <div class="time" v-if="item.showTime">{{ item.time }}</div>
            <div class="comment_box" :class="{
              'single_comment': item.type != 'group',
              'comment-box-we': item.from == username,
              'comment-box-other': item.from != username
            }">
              <el-avatar class="comment_avator"
                src="https://tse1-mm.cn.bing.net/th/id/OIP-C.WKDEAgwE4K8yFVjobmQzqgHaHa" />
              <div class="comment_username_message">
                <div class="comment-username" v-if="item.type == 'group'">{{ emailMap[item.from] }}</div>
                <div class="comment" v-html="item.message"></div>
              </div>
            </div>
          </div>
        </el-main>
        <!-- 输入框 -->
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
let socket;
import MyCat from '@/components/MyCat.vue';
import { getUserList, getMessageList } from '@/api/api'
import ChatLoading from '@/components/ChatLoading.vue';
export default {
  name: 'app',
  components: {
    MyCat,
    ChatLoading
  },
  data() {
    return {
      ip: "",
      sendMessage: "",
      chatUser: {},
      userlist: [],
      emailMap: {},
      messageList: {
        isLoading: false,
        page: {}
      },
      username: "",
      isCollapse: false,
      userCount: 0,
      justTime: {}
    }
  },
  watch: {
    chatUser: {
      deep: true,
      handler({ email, username, type }) {
        this.getStoreMessage({
          to: email,
          from: this.username,
          type,
          startNum: this.messageList.page[email] ? this.messageList.page[email].count : 0,
          pageSize: 10
        })
        this.scrollFun("send")
      }
    }
  },
  mounted() {
    document.title = "聊天室"
    this.username = this.$route.params.email
    this.$refs.chatBody.$el.addEventListener('scroll', this.messageLazyLoad)
    this.ip = localStorage.getItem("ip")
    this.chatUser = { username: "群组聊天", email: "group", type: "group" };
    this.init()
  },
  computed: {

  },
  methods: {
    //初始化，进行websocket的链接
    /**
     * 开启一个websocket服务，连接成功触发打开事件
     * 1.onmessage 浏览器端收消息，获得从服务端发送过来的文本消息
     *  data 消息数据，对data进行判断区分是系统消息还是用户消息
     *    (1)系统消息：更新人数，更新列表，进行邮箱和用户名的映射
     *    (2)用户消息：添加到数组中，首先要查看数组中是否存在，然后分为两种不同的走向
     *  最后触发scrollFun()事件，让条滚到底部
     */
    init() {
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        let socketUrl = "ws://" + this.ip + "/chat/server/" + this.username + '?token=' + localStorage.getItem("token");
        if (socket != null) {
          socket.close();
          socket = null;
        }
        socket = new WebSocket(socketUrl);
        socket.onopen = function () {
          console.log("websocket已打开");
        };
        socket.onmessage = (msg) => {
          let data = JSON.parse(msg.data);
          if (data.type == "system") {
            this.getUserList(data.users)
            this.userCount = data.count
          } else {
            if (data.type == "group") {
              this.addMessageList(data.to, data)
            } else {
              this.addMessageList(data.from, data)
            }
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
        if (this.chatUser.type == "group") {
          to = "group"
          message = {
            type: "group",
            to: "group",
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
        let send_data = { from: this.username, to, message: this.sendMessage, time, type: message.type, showTime };
        this.addMessageList(to, send_data)
        this.sendMessage = '';
      }
      this.scrollFun("send")
    },
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
      getUserList().then(res => {
        let arr = res.data.data
        let map = {};
        arr.forEach((item) => {
          delete item.password
          map[item.email] = item.username
          item.online = onlineUser.has(item.email)
        })
        this.emailMap = map
        this.userlist = arr
      }).catch(error => {
        localStorage.setItem("autoLogin", false);
        this.$message({ type: "warning", message: "验证过期，请重新登录" })
        this.$router.replace("/login")
      });
    },
    //是否显示时间
    showTime(name) {
      let nowTime = new Date().getTime() / 1000
      let bool = (nowTime - (this.justTime[name] ? this.justTime[name] : 0) > 1200)
      this.$set(this.justTime, name, nowTime)
      return bool
    },
    //选择用户
    choiceUser(item) {
      this.sendMessage = ""
      if (item) {
        this.chatUser = { username: item.username, email: item.email, type: 'single' }
      } else {
        this.chatUser = { username: "群组聊天", email: "group", type: 'group' }
      }
    },
    //将消息添加到对象列表中
    addMessageList(key, value, desc) {
      //判断是否是倒序插入
      if (desc) {
        if (this.messageList[key]) {
          this.messageList[key].unshift(value)
          this.messageList.page[key].count++
        } else {
          this.$set(this.messageList, key, [value])
        }
      } else {
        if (this.messageList[key]) {
          this.messageList[key].push(value)
          this.messageList.page[key].count++
        } else {
          this.$set(this.messageList, key, [value])
        }
      }
      this.scrollFun()

    },
    /**
     *  发送消息直接到底部
     *  分为三种,
     * 1. type == "send",不管距离底部的高度直接滚动到底部,一般是发送消息时
     * 2. type == "request" 这种用于消息懒加载时,保留之前的高度 
     * 3. 另一种是不进行填入,这种要看距离底部的高度,一般是接收消息时
     */
    scrollFun(type) {
      //获取元素节点,其实不加这句话也一样,可以通过id直接获取
      let chatBody = this.$refs.chatBody.$el
      let scrollHeight1 = chatBody.scrollHeight
      let scrollTop1 = chatBody.scrollTop
      let height = chatBody.clientHeight
      if (type == "send") {
        this.$nextTick(() => {
          chatBody.scrollBy(0, chatBody.scrollHeight)
        })
      } else if (type == "request") {
        this.$nextTick(() => {
          let scrollHeight2 = chatBody.scrollHeight
          chatBody.scrollBy(0, scrollHeight2 - scrollHeight1)
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
    //消息懒加载，滚到顶部加载更多
    //isLoading 防止多次请求
    messageLazyLoad() {
      let top = chatBody.scrollTop;
      let scrollHeight = chatBody.scrollHeight;
      let height = chatBody.clientHeight;
      if (top < 1 && !this.messageList.isLoading && scrollHeight != height) {
        let { email, type } = this.chatUser;
        this.getStoreMessage({
          to: email,
          from: this.username,
          type,
          startNum: this.messageList.page[email] ? this.messageList.page[email].count : 0,
          pageSize: 10
        })
      }
    },
    //ctrl+enter发送消息
    keypressFun(event) {
      if (event.ctrlKey && event.code == "Enter") {
        this.send()
      }
    },
    getStoreMessage(params) {
      //判断是否应该扩容，没有该对象，或者还有更多就进行扩容
      if (!this.messageList.page[params.to] || this.messageList.page[params.to].isMore) {
        this.messageList.isLoading = true;
        getMessageList(params).then(res => {
          let obj = res.data.data;
          let messageList = obj.messageList;
          //进行一次初始化
          if (!this.messageList.page[obj.to]) {
            this.messageList.page[obj.to] = { count: 1, isMore: obj.count == obj.pageSize }
          } else {
            this.messageList.page[obj.to].isMore = (obj.count == obj.pageSize)
          }

          messageList.forEach(item => {
            let timeSplit = item.send_time.split('T')
            let time = `${timeSplit[0]} ${timeSplit[1].substr(0, 5)}`
            let message = {
              from: item.from_user,
              message: item.message,
              time,
              showTime: item.show_time,
              to: item.to_user,
              type: item.type
            }
            this.addMessageList(obj.to, message, true)
          })
          this.scrollFun("request");
          this.messageList.isLoading = false;
        })
      }

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
  background-image: url(../assets/images/mygo.jpg);
  background-position-x: 10vw;
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
  color: black;
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
  border: none;
  background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
}

#chatBody {
  height: 67vh;
  margin-top: 1vh;
  margin-bottom: 1vh;
  overflow-x: hidden;
}

#chatBody .time {
  text-align: center;
  margin: 2rem 0;
  color: white;
}

/* 可选：为.comment添加一些阴影以增加视觉深度 */
/**
  other为其他人的消息
  we为自己发送的消息
  single为单人聊天的消息，和群组聊天不同，需要分开渲染
*/


/* 消息盒子，包括头像，用户名和消息 */
.comment_box {
  display: flex;
  margin-top: 2rem;
}

.comment-box-we {
  flex-direction: row-reverse;
}

.comment-box-other {}

/* 聊天头像框样式 */
/*
  flex-shrink 禁止被压缩
*/
.comment_avator {
  margin-top: 1.2rem;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  flex-shrink: 0
}

.comment-box-we .comment_avator {
  margin-left: 1rem;
}

.comment-box-other .comment_avator {
  margin-right: 1rem;
}

.single_comment .comment_avator {
  margin-top: 0rem;
}

/* 

    用户名和消息外面的盒子，用于分割头像
    宽度无所谓，占用剩余空间 flex-grow

*/
.comment_username_message {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.comment-box-other .comment_username_message {
  align-items: flex-start;

}

.comment-box-we .comment_username_message {
  align-items: flex-end;
}

/* 消息上面的用户名样式 */

.comment-username {
  padding: 0.4rem;
  /* 添加底部外边距以分隔评论数据和评论内容 */
  /* 可选：添加内边距以增加可读性 */
  box-sizing: border-box;
  /* 确保内边距不会增加元素的外部宽度 */
  font-size: 1.1rem;
  color: white;
  /* margin-left: 280px; */
}

.comment-box-other .comment-username {
  text-align: left;
}

.comment-box-we .comment-username {
  text-align: right;
}

/* 聊天消息样式 */

.comment {
  border-radius: 0.5rem;
  padding: 1rem;
  box-sizing: border-box;
  text-align: left;
  white-space: pre-wrap;
  /* 保留换行符 */
  word-wrap: break-word;
  /* 防止长单词或URL破坏布局 */
  font-size: 1.2rem;
  max-width: 80%;
  display: inline-block;
  position: relative;
}

.single_comment .comment {
  margin-top: 1.1rem;
}

.comment-box-other .comment {
  background: #f89999;
  text-align: left;
}

/* 我方发送消息时的气泡效果 部分 */
.comment-box-we .comment {
  background: #8ec5fc;
  text-align: left;
}

/* 对话框小尾巴 */

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
