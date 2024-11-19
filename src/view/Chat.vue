<template>
  <div class="main">
    <div id="box">
      <div class="app">
        <Transition name="fade">
          <Levitation  width="200px" height="150px" :levitem="levitem" v-if="levitem.open"></Levitation>
        </Transition>
      </div>
      <el-main id="left">
        <div class="leftList">
          <div class="userListStyle">群组聊天( 当前人数：{{ userCount }} )</div>
          <div class="leftItem" @click="choiceUser()" :class="{ currentCss: chatUser.email == 'group' }">
            <div style="text-align: center; line-height: 4rem">群组聊天</div>
          </div>
        </div>

        <div class="leftList">
          <div class="userListStyle" @click="userlistOpen = !userlistOpen">
            用户列表
          </div>
          <div class="leftItem" :class="{
            'currentCss':chatUser.email==item.email,
            'isLine' : item.online,
            'notLine' : !item.online}" 
            v-for="(item, index) in userlist" :key="index"
            @click="choiceUser(item)" v-show="userlistOpen"> 
              <img :src="getUserAvatar(item.email)" class="avatarCss" :class="emailMap[item.email]?.messagePrompt?'avatarCss2':'avatarCss'" @mouseover="avatarlev($event,item)" @mouseleave="avatarout()">
              {{ item.username }}
          </div>
        </div>
      </el-main>

      <div id="right">
        <!-- 显示当前对话的用户 -->
        <div id="chatHeader">{{ chatUser.username }}</div>
        <!-- 消息列表 -->
        <el-main id="chatBody" ref="chatBody" @onscroll="messageLazyLoad">
          <chat-loading :isLoading="messageList.isLoading" text="消息正在赶来喵~" />
          <div v-for="(item, index) in messageList[chatUser.email]" :key="index">
            <div class="time" v-if="item.showTime">{{ item.time }}</div>
            <div class="comment_box" :class="{
              single_comment: item.type != 'group',
              'comment-box-we': item.from == username,
              'comment-box-other': item.from != username,
            }">
              <el-avatar class="comment_avatar" :src="getUserAvatar(item.from)" />
              <div class="comment_username_message">
                <div class="comment-username" v-if="item.type == 'group'">
                  {{ getUsername(item.from) }}
                </div>
                <div class="comment" v-html="item.message"></div>
              </div>
            </div>
          </div>
        </el-main>
        <!-- 输入框 -->
        <div id="chatFooter" @keypress="keypressFun">
          <el-input id="areaMsg" type="textarea" :rows="2" placeholder="请输入内容" v-model="sendMessage">
          </el-input>
          <button type="primary" id="sendBtn" @click="send">发送消息</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let socket;
import MyCat from '@/components/myCat/MyCat.vue';
import Levitation from '@/components/Levitation';
import { getUserList, getMessageList } from '@/api/api'
import ChatLoading from '@/components/ChatLoading.vue';
import { getRandomNum } from '@/utils/utils'
export default {
  name: "chat",
  components: {
    MyCat,
    ChatLoading,
    Levitation
  },
  data() {
    return {
      userlistOpen:false,
      //个人主页定时器
      levtime:"",
      //个人主页数据
      levitem:{
        open:false,
        left:"",
        top:"",
        PersonalHomepage:{}
      },
      //群组
      groupHint: {
        num: 0,
        messagePrompt: false,
      },
      ip: "",
      sendMessage: "",
      chatUser: {},
      userlist: [],
      emailMap: {},
      messageList: {
        isLoading: false,
        page: {},
      },
      username: "",
      isCollapse: false,
      userCount: 0,
      justTime: {},
    };
  },
  watch: {
    chatUser: {
      deep: true,
      handler({ email, username, type }) {
        this.getStoreMessage({
          to: email,
          from: this.username,
          type,
          startNum: this.messageList.page[email]
            ? this.messageList.page[email].count
            : 0,
          pageSize: 10,
        });
        this.scrollFun("send");
      },
    },
  },
  mounted() {
    document.title = "聊天室";
    this.username = this.$route.params.email;
    this.$refs.chatBody.$el.addEventListener("scroll", this.messageLazyLoad);
    this.ip = localStorage.getItem("ip");
    this.chatUser = { username: "群组聊天", email: "group", type: "group" };
    this.init();
  },
  computed: {},
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
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        let socketUrl =
          "ws://" +
          this.ip +
          "/chat/server/" +
          this.username +
          "?token=" +
          localStorage.getItem("token");
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
            this.getUserList(data.users);
            this.userCount = data.count;
          } else {
            if (data.type == "group") {
              //群组消息提示
              if (this.chatUser.email != "group") {
                this.groupHint.messagePrompt = true;
                this.groupHint.num++;
              }
              this.addMessageList(data.to, data);
            } else {
              //用户列表消息提示
              console.log(data);
              if (this.chatUser.email != data.from) {
                this.$set(this.emailMap[data.from], "messagePrompt", true);
              }
              this.addMessageList(data.from, data);
            }
          }
        };
        //关闭事件
        socket.onclose = function () { };
        //发生了错误事件
        socket.onerror = function () { };
      }
    },
    //发送消息
    send() {
      if (!this.chatUser.email) {
        this.$message({ type: "warning", message: "请选择聊天对象" });
        return;
      }
      if (!this.sendMessage) {
        this.$message({ type: "warning", message: "请输入内容" });
        return;
      }
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        let message;
        let to;
        if (this.chatUser.type == "group") {
          to = "group";
          message = {
            type: "group",
            to: "group",
            message: this.sendMessage,
          };
        } else {
          to = this.chatUser.email;
          message = {
            type: "single",
            to: this.chatUser.email,
            message: this.sendMessage,
          };
        }
        let showTime = this.showTime(to);
        socket.send(JSON.stringify(message));
        let h = new Date();
        let time = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(
          2,
          0
        )}-${String(h.getDate()).padStart(2, 0)} ${String(
          h.getHours()
        ).padStart(2, 0)}:${String(h.getMinutes()).padStart(2, 0)}`;
        let send_data = {
          from: this.username,
          to,
          message: this.sendMessage,
          time,
          type: message.type,
          showTime,
        };
        //判断消息是否存在
        this.addMessageList(to, send_data);
        this.sendMessage = "";
      }
      this.scrollFun("send");
    },
    /**
     * ["username","username"]
     * [{username,email,isLogin},{},{}]
     * 用于将邮箱映射为名字，获取用户列表
     */
    getUserList(webList) {
      let onlineUser = new Set();
      webList.forEach((item) => {
        onlineUser.add(item.username);
      });
      getUserList()
        .then(res => {
          let arr = res.data.data
          let map = {};
          arr.forEach((item) => {
            delete item.password;
            map[item.email] = {
              username: item.username,
              avatar: item.avatar,
            }
            item.online = onlineUser.has(item.email)
          })
          this.emailMap = map
          this.userlist = arr
        }).catch(error => {
          localStorage.setItem("autoLogin", false);
          this.$message({ type: "warning", message: "验证过期，请重新登录" });
          this.$router.replace("/login");
        });
    },
    //通过email获取头像
    getUserAvatar(email) {
      let avatar = this.emailMap[email]?.avatar
        ? this.emailMap[email].avatar
        : "http://" +
        this.ip +
        "/chat/file/download/1/98859171c9c04d3897b1dc857185b738";
      return avatar;
    },
    //通过email获取名字
    getUsername(email) {
      let username = this.emailMap[email]?.username;
      username = username
        ? username
        : "御坂" + getRandomNum(10000, 20000) + "号";
      return username;
    },
    //是否显示时间
    showTime(name) {
      let nowTime = new Date().getTime() / 1000;
      let bool =
        nowTime - (this.justTime[name] ? this.justTime[name] : 0) > 1200;
      this.$set(this.justTime, name, nowTime);
      return bool;
    },
    //选择用户
    choiceUser(item) {
      this.sendMessage = "";
      if (item) {
        this.chatUser = {
          username: item.username,
          email: item.email,
          type: "single",
        };
        this.emailMap[item.email].messagePrompt = false;
      } else {
        this.chatUser = { username: "群组聊天", email: "group", type: "group" };
      }
    },
    //将消息添加到对象列表中
    addMessageList(key, value, desc) {
      if (!this.messageList.page[key]) {
        this.messageList.page[key] = { count: 1, isMore: true };
      }
      //判断是否是倒序插入
      if (desc) {
        if (this.messageList[key]) {
          this.messageList[key].unshift(value);
          this.messageList.page[key].count++;
        } else {
          this.$set(this.messageList, key, [value]);
        }
      } else {
        if (this.messageList[key]) {
          this.messageList[key].push(value);
          this.messageList.page[key].count++;
        } else {
          this.$set(this.messageList, key, [value]);
        }
      }
      this.scrollFun();
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
      let chatBody = this.$refs.chatBody.$el;
      let scrollHeight1 = chatBody.scrollHeight;
      let scrollTop1 = chatBody.scrollTop;
      let height = chatBody.clientHeight;
      if (type == "send") {
        this.$nextTick(() => {
          chatBody.scrollBy(0, chatBody.scrollHeight);
        });
      } else if (type == "request") {
        this.$nextTick(() => {
          let scrollHeight2 = chatBody.scrollHeight;
          chatBody.scrollBy(0, scrollHeight2 - scrollHeight1);
        });
      } else {
        this.$nextTick(() => {
          let scrollHeight2 = chatBody.scrollHeight;
          if (scrollHeight1 - scrollTop1 <= height) {
            chatBody.scrollBy(0, scrollHeight2);
          }
        });
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
          startNum: this.messageList.page[email]
            ? this.messageList.page[email].count
            : 0,
          pageSize: 10,
        });
      }
    },
    //ctrl+enter发送消息
    keypressFun(event) {
      if (event.ctrlKey && event.code == "Enter") {
        this.send();
      }
    },
    //获取存储的消息
    getStoreMessage(params) {
      //判断是否应该扩容，没有该对象，或者还有更多就进行扩容
      if (
        !this.messageList.page[params.to] ||
        this.messageList.page[params.to].isMore
      ) {
        this.messageList.isLoading = true;
        getMessageList(params).then((res) => {
          let obj = res.data.data;
          let messageList = obj.messageList;
          //进行一次初始化
          if (!this.messageList.page[obj.to]) {
            this.messageList.page[obj.to] = {
              count: 1,
              isMore: obj.count == obj.pageSize,
            };
          } else {
            this.messageList.page[obj.to].isMore = obj.count == obj.pageSize;
          }

          messageList.forEach((item) => {
            let timeSplit = item.send_time.split("T");
            let time = `${timeSplit[0]} ${timeSplit[1].substr(0, 5)}`;
            let message = {
              from: item.from_user,
              message: item.message,
              time,
              showTime: item.show_time,
              to: item.to_user,
              type: item.type,
            };
            this.addMessageList(obj.to, message, true);
          });
          this.scrollFun("request");
          this.messageList.isLoading = false;
        });
      }
    },
//获取头像位置
    avatarlev(e,item){
      item.avatar=this.getUserAvatar(item.email)
      let rect=e.target.getBoundingClientRect()
      this.levitem.left=rect.right+3+'px'
      this.levitem.top=rect.bottom-80+'px'
      this.levitem.PersonalHomepage=item
      this.levtime=setTimeout(() => {
        this.levitem.open=true
      }, 500);
    },
    //头像移出
    avatarout(){
      this.levitem.open=false
      clearTimeout(this.levtime)
    }
  }
}
</script>

<style lang="less">
* {
  margin: 0px;
  padding: 0px;
}

.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#box {
  background-image: url(@/assets/images/mygo.jpg);
  background-position-x: 10vw;
  background-size: cover;
  display: flex;
  height: 100vh;
  width: 100%;
}

#left {
  background: linear-gradient(120deg, #e0c3fc88 0%, #8ec5fc88 100%);
  width: 20%;
  padding: 1.5rem;
  font-size: 1.3rem;
  /* 亚卡力效果 */
  backdrop-filter: blur(3rem);

  // overflow: hidden;
  .userListStyle {
    width: 28rem;
    height: 4rem;
  }

  //头像样式
  .avatarCss {
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
    margin-right: 1vw;
    box-sizing: border-box;
    // animation: ani 2s linear infinite;
  }

  .avatarCss2 {
    animation: hiteani 0.8s linear infinite;
  }

  .currentCss {
    // background: radial-gradient(circle at 32.2% 83.5%, rgb(239, 167, 167) 0%, rgb(215, 123, 191) 90%) !important;
    backdrop-filter: blur(10rem);
    background: none !important;
  }

  .leftList {
    line-height: 4rem;
    margin: 0;
    padding: 0;
  }

  .leftList .leftItem {
    margin: 0.6rem 0;
    padding: 0.25rem 1rem;
    /* display: inline-block; */
    width: calc(100% - 2rem);
    height: 4rem;
    display: flex;

    line-height: 4rem;
  }

  .leftList .leftItem:hover {
    background: rgba(247, 137, 137, 0.274);
  }

  .isLine {
    color: black;
    font-weight: 800;
  }

  .notLine {
    color: #333;
  }
}

ul {
  list-style: none;
  overflow: hidden;
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
  box-sizing: border-box;
  height: 27vh;
  padding: 0 1vh;
  background-color: #4ddff3;
  border-radius: 1vh;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  z-index: 10;
  //动画
  &::before{n
    content: "";
    width: 200%;
    height: 700%;
    position: absolute;
    left: -50%;
    top: -300%;
    background: conic-gradient(#c1fce5,#adffff,#f3cdff,#fbd786,#fbd786,#f3cdff,#adffff,#c1fce5);
    z-index: -2;
    animation: rotate 6s linear infinite;
  }
  //动画上的蒙版
  &::after {
    content: "";
    position: absolute;
    inset: 0.8vh;
    backdrop-filter: blur(10rem);
    background-image: url(@/assets/images/chat_area_bg.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: 65%;
    border-radius: 1vh;
    z-index: -1;
  }
}

#areaMsg {
  color: black;
  box-sizing: border-box;
  padding: 1rem;
  margin: 1vh 0 1vh;
  height: 19vh;
  font-size: 2rem;
  width: 100%;
  resize: none;
  word-break: break-all;
  background: transparent;
  border: none;
  outline: none;
}

#sendBtn {
  float: right;
  height: 3.2rem;
  padding: 0.8rem 2rem 0.9rem;
  font-size: 1.2rem;
  margin-top: 1vh;
  margin-right: 1vw;
  border: none;
  background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
  position: relative;
  border-radius: 1vh;
  bottom: 1.5rem;
  &.active{
    transform: scale(0.95);
  }
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

/* 聊天头像框样式 */
/*
  flex-shrink 禁止被压缩
*/
.comment_avatar {
  margin-top: 1.2rem;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  flex-shrink: 0;
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
  word-break: break-all;
  font-size: 1.2rem;
  max-width: 80%;
  display: inline-block;
  position: relative;
}

/* 对话框小尾巴 */
.comment:after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: 0.2rem;
  /* 将 right 改为 left，并设置偏移量 */
  border: solid 0.8rem;
  /* 修改边框颜色顺序 */
  font-size: 0;
}

.comment-box-we {
  flex-direction: row-reverse;

  .comment_avatar {
    margin-left: 1rem;
  }

  .comment_username_message {
    align-items: flex-end;
  }

  .comment-username {
    text-align: right;
  }

  .comment {
    background: #8ec5fc;
  }

  .comment:after {
    right: -1.4rem;
    border-color: transparent transparent transparent #8ec5fc;
  }
}

.comment-box-other {
  .comment_avatar {
    margin-right: 1rem;
  }

  .comment_username_message {
    align-items: flex-start;
  }

  .comment-username {
    text-align: left;
  }

  .comment {
    background: #f89999;
  }

  .comment:after {
    left: -1.4rem;
    border-color: transparent #f89999 transparent transparent;
  }
}

.single_comment {
  .comment_avatar {
    margin-top: 0rem;
  }

  .comment {
    margin-top: 1.1rem;
  }
}
.fade-leave,   // 离开前,进入后透明度是1
.fade-enter-to {
  opacity: 1;
}
.fade-leave-active,
.fade-enter-active {
  transition: all 0.5s; //过度是2秒
}
.fade-leave-to,
.fade-enter {
  opacity: 0;
}
//滚动条
@supports (scrollbar-color: auto) {

  #chatBody,
  #left,
  #areaMsg {
    scrollbar-color: rgba(0, 0, 0, 0) rgba(255, 154, 150, 0);
    transition: scrollbar-color 0.2s linear;
  }

  #chatBody:hover,
  #left:hover,
  #areaMsg {
    scrollbar-color: rgb(124, 213, 255) rgba(255, 136, 136, 0);
  }
}

@keyframes ani {
  0% {
    box-shadow: 0 0 0px hsl(0, 94%, 60%);
  }

  25% {
    box-shadow: 0 0 0.8rem #ff8329;
  }

  50% {
    box-shadow: 0 0 1.6rem #a4b239ac;
  }

  75% {
    box-shadow: 0 0 0.8rem #5bff29;
  }

  100% {
    box-shadow: 0 0 0px #ff8329;
  }
}

@keyframes hiteani {
  0% {
    box-shadow: 0 0 1.5rem hsl(0, 94%, 60%);
  }

  25% {
    box-shadow: 0 0 2.5rem #ff8329;
  }

  50% {
    box-shadow: 0 0 3.5rem #a4b239ac;
  }

  75% {
    box-shadow: 0 0 2.5rem #5bff29;
  }

  100% {
    box-shadow: 0 0 1.5rem #ff8329;
  }
}
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
