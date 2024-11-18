<template>
  <!-- 导航菜单组件，支持拖拽和点击展开隐藏 -->
  <nav class="menu" id="menu">
    
    <input type="checkbox" class="menu-toggler"  v-model="isMenuOpen" />
    <!-- 自定义的菜单切换器图标 -->
    <div class="custom-toggler" :class="isMenuOpen?'checkToggler':'notCheckToggler'" id="custom-toggler" 
    @mousedown="startDrag" @mouseup="stopDrag"  @click="openMenu" @mouseover="showCat" @mouseout="hiddenCat">
    </div>
    <!-- 菜单项列表 -->
    <ul>
      <li class="menu-item" v-for="(item, index) in menuItems" :style="`--i:${index};`" :key="index" @click="toItem(item.path)" :title="item.title" >
        <div class="itemBox">
          <div class="image" :style="`background-image:url(${item.image});`"></div>
          <div>{{item.text}}</div>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      // 菜单的位置信息
      position: { x: 10, y: 300 },
      // 鼠标按下时的初始位置
      initialMousePos: { x: 0, y: 0 },
      storageOpen:false,
      // 标记是否正在拖拽
      dragging: false,
      // 控制菜单的显示与隐藏
      isMenuOpen: false,
      // 按钮图片
      checkImage:require('./img/isMygo.png'),
      // 菜单项数组，包含链接和背景图片
      menuItems: [
        { path: '#', image: require('./img/02.png'),icon:"",text:"更多",title:"小猫，你可以演奏春日影"},
        { path: '#', image: require('./img/03.png'),icon:"",text:"音乐",title:"一阵强劲的鼓点响起"},
        { path: '#', image: require('./img/04.png'),icon:"",text:"聊天",title:"说谁唐呢，Anon世界第一可爱"},
        { path: '#', image: require('./img/05.png'),icon:"",text:"主页",title:"一定要组一辈子工坊啊"},
        { path: '/login', image: require('./img/06.png'),icon:"",text:"退出",title:"长期素食导致的"},
      ]
    };
  },
  mounted(){
    this.changePosition()
  },
  methods: {
    toItem(item){
      if(item == '/login'){
        localStorage.setItem("autoLogin",false)
        this.$router.replace(item)
      }
    },
    openMenu(){
      if(this.dragging) return;
      this.isMenuOpen = !this.isMenuOpen
      let menuItems = document.getElementsByClassName('menu-item');
      for(let i = 0; i < menuItems.length; i++){
        let item = menuItems[i];
        item.style.left = this.position.x + 'px'
        item.style.top = this.position.y + 'px'
      }
    },
    // 开始拖拽事件处理函数
    startDrag(event) {
      event.preventDefault();
      this.dragging = true;
      this.storageOpen = this.isMenuOpen
      this.isMenuOpen = false;
      this.initialMousePos = { x: event.clientX, y: event.clientY };
      // 添加鼠标移动和鼠标释放事件监听
      document.addEventListener('mousemove',this.onDrag);
    },
    // 拖拽中事件处理函数
    onDrag(event) {
      event.preventDefault();
      if (this.dragging) {
        // 计算新的位置
        let newX = this.position.x + (event.clientX - this.initialMousePos.x);
        let newY = this.position.y + (event.clientY - this.initialMousePos.y);

        // 更新位置 
        this.position.x = newX;
        this.position.y = newY;
        this.changePosition()
        

        // 更新鼠标初始位置，以便下一次计算
        this.initialMousePos = { x: event.clientX, y: event.clientY };
      }
    },
    // 停止拖拽事件处理函数
    stopDrag(event) {
      event.preventDefault();
      let menuItems = document.getElementsByClassName('menu-item');
      document.removeEventListener('mousemove',this.onDrag);
      for(let i = 0; i < menuItems.length; i++){
        let item = menuItems[i];
        // if(this.storageOpen){
        //   item.style.opacity = 0
        // }else{
        //   item.style.opacity = 1
        // }
        item.style.left = this.position.x + 'px'
        item.style.top = this.position.y + 'px'
      }

      this.dragging = false;
      this.isMenuOpen = this.storageOpen
    },
    //鼠标移入事件：
    showCat(){
      if (this.dragging) return;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const width = this.$el.offsetWidth;
      const height = this.$el.offsetHeight;
      const maxX = windowWidth - width;
      const maxY = windowHeight - height;

      // 确保菜单不会移出视窗
      if (this.position.x < 5) this.position.x = 0;
      if (this.position.x > maxX - 5) this.position.x = maxX;
      if (this.position.y < 5) this.position.y = 0;
      // if (this.position.y > maxY - 5) this.position.y = maxY;

      this.changePosition();
    },
    //鼠标移出事件：
    hiddenCat(){
      if (this.dragging || this.isMenuOpen) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const width = this.$el.offsetWidth;
      const height = this.$el.offsetHeight;
      const maxX = windowWidth - width;
      const maxY = windowHeight - height;

      // 确保菜单不会移出视窗，并调整到隐藏一半
      if (this.position.x < 5) this.position.x = -width; // 左边隐藏一半
      if (this.position.x > maxX - 5) this.position.x = maxX + width / 2; // 右边隐藏一半
      if (this.position.y < 5) this.position.y = -height; // 上方隐藏一半
      if (this.position.y > maxY - 15) this.position.y = maxY + height/2; // 下方隐藏一半

      this.changePosition();
    },
    //改变位置
    changePosition(){
      let menuMain = document.getElementById('custom-toggler');
      menuMain.style.left = this.position.x+'px'
      menuMain.style.top = this.position.y+'px'
      let menuItems = document.getElementsByClassName('menu-item');
      for(let i = 0; i < menuItems.length; i++){
          let item = menuItems[i];
          item.style.left = this.position.x + 'px'
          item.style.top = this.position.y + 'px'
      }
    },
    //将px转换为rem
    pxToRem(num){
      let fontSize = Number(getComputedStyle(document.documentElement).fontSize.replace("px",""));
      return num/12 *  fontSize
    }
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

body {
  background-size: cover;
  height: 100vh;
}

.menu {
  position: fixed;
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 19;
}

.menu-toggler {
  position: relative;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 5rem;
  /* Adjust as needed for your custom image */
  height: 5rem;
  /* Adjust as needed for your custom image */
  z-index: 2;
  opacity: 0;
  cursor: pointer;
}

/* 中间按钮的样式 */
.custom-toggler {
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 5rem;
  /* Adjust to fit your custom image */
  height: 5rem;
  /* Adjust to fit your custom image */
  background-size: cover;
  cursor: pointer;
  border-radius: 50%;
  z-index: 10;
}
.notCheckToggler{
  background-image: url("./img/01.jpg");
  background-position-y: -0.8rem;
}
.checkToggler{
  background-image: url("./img/isMygo.png");
  background-position-y: 0rem;
}

.menu-toggler:checked~ul .menu-item {
  opacity: 1;
}

.menu-toggler:checked~ul .menu-item:nth-child(1) {
  transform: rotate(0deg) translateX(-6rem);
}

.menu-toggler:checked~ul .menu-item:nth-child(2) {
  transform: rotate(72deg) translateX(-6rem);
  /* Changed to 72deg for 5 items */
}

.menu-toggler:checked~ul .menu-item:nth-child(3) {
  transform: rotate(144deg) translateX(-6rem);
  /* Changed to 144deg */
}

.menu-toggler:checked~ul .menu-item:nth-child(4) {
  transform: rotate(216deg) translateX(-6rem);
  /* Changed to 216deg */
}

.menu-toggler:checked~ul .menu-item:nth-child(5) {
  transform: rotate(288deg) translateX(-6rem);
  /* Changed to 288deg */
}

.menu-item {
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 5rem;
  height: 5rem;
  opacity: 0;
  transition: transform  0.2s , opacity 0.5s ;
  
  /* left calc(0.01s + 0.01s * var(--i)) , top calc(0.01s + 0.01s * var(--i)); */
  z-index: 1;
  border-radius: 50%;
  /* backdrop-filter: blur(0.1rem); */
}
.menu-item .itemBox{
  width: inherit;
  height: inherit;
  border-radius: 50%;
  text-align: center;
  font-size: 1rem;
  color: white;
  text-shadow: 
        -0.1rem -0.1rem 0 #38b, /* 上左 */
         0.1rem -0.1rem 0 #38b, /* 上右 */
        -0.1rem  0.1rem 0 #38b, /* 下左 */
         0.1rem  0.1rem 0 #38b; /* 下右 */
}
.menu-item .image {
  margin-top: 0.3rem;
  display: inline-block;
  width: 3rem;
  height: 3rem;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  text-decoration: none;
  pointer-events: none;
  transition: 0.2s;
  box-shadow: 0 0 1rem white;
}
.menu-item .image::before  {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* backdrop-filter: blur(0.1rem); */
  mix-blend-mode: multiply; /* 实现与背景的混合 */
  border-radius: 50%; /* 确保与背景图片保持一致 */
  z-index: 2; /* 保证蒙版在图片上方 */
  pointer-events: none; /* 防止蒙版影响交互 */
  background-color: #FDFFFC;
}
.menu-item:nth-child(1) .itemBox{
  background-color: #e8dfdb;
}
.menu-item:nth-child(2) .itemBox{
  background-color: #b788ad;
}
.menu-item:nth-child(3) .itemBox{
  background-color: #f9dde2;
}
.menu-item:nth-child(4) .itemBox{
  background-color: #a49aa2;
}
.menu-item:nth-child(5) .itemBox{
  background-color: #c6a29c;
}
.menu-item:nth-child(1) .itemBox {
  transform: rotate(0deg);
}

.menu-item:nth-child(2)  .itemBox{
  transform: rotate(-72deg);
  /* Changed to -72deg for 5 items */
}

.menu-item:nth-child(3)  .itemBox{
  transform: rotate(-144deg);
  /* Changed to -144deg */
}

.menu-item:nth-child(4)  .itemBox{
  transform: rotate(-216deg);
  /* Changed to -216deg */
}

.menu-item:nth-child(5)  .itemBox{
  transform: rotate(-288deg);
  /* Changed to -288deg */
}

.menu-item .itemBox:hover {
  box-shadow: 0 0 0.5rem 0.2rem whitesmoke;
}

</style>