<template>
  <!-- 导航菜单组件，支持拖拽和点击展开隐藏 -->
  <nav class="menu" @mousedown="startDrag" :style="{ top: `${position.y}px`, left: `${position.x}px` }">
    <!-- 隐藏的checkbox，用于控制菜单的展开和隐藏 -->
    <input type="checkbox" class="menu-toggler" id="menu_toggler" v-model="isMenuOpen" />
    <!-- 自定义的菜单切换器图标 -->
    <div class="custom-toggler" :style="{ backgroundImage: 'url(' + togglerImage + ')' }"></div>
    <!-- 菜单项列表 -->
    <ul>
      <li class="menu-item" v-for="(item, index) in menuItems" :key="index">
        <!-- 菜单项的链接，背景图片由menuItems数组提供 -->
        <a :href="item.href" :style="{ backgroundImage: 'url(' + item.image + ')' }"></a>
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
      position: { x: 100, y: 100 },
      // 鼠标按下时的初始位置
      initialMousePos: { x: 0, y: 0 },
      // 标记是否正在拖拽
      dragging: false,
      // 控制菜单的显示与隐藏
      isMenuOpen: false,
      // 按钮图片
      togglerImage: require('@/assets/images/03.jpg'),
      // 菜单项数组，包含链接和背景图片
      menuItems: [
        { href: '#', image: require('@/assets/images/02.png') },
        { href: '#', image: require('@/assets/images/02.png') },
        { href: '#', image: require('@/assets/images/02.png') },
        { href: '#', image: require('@/assets/images/02.png') },
        { href: '#', image: require('@/assets/images/02.png') },
      ],
    };
  },
  methods: {
    // 开始拖拽事件处理函数
    startDrag(event) {
      this.dragging = true;
      this.initialMousePos = { x: event.clientX, y: event.clientY };
      // 添加鼠标移动和鼠标释放事件监听
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);
    },
    // 拖拽中事件处理函数
    onDrag(event) {
      if (this.dragging) {
        // 计算新的位置
        let newX = this.position.x + (event.clientX - this.initialMousePos.x);
        let newY = this.position.y + (event.clientY - this.initialMousePos.y);

        // 边界控制逻辑
        const maxX = window.innerWidth - this.$el.offsetWidth;
        const maxY = window.innerHeight - this.$el.offsetHeight;

        // 确保菜单不会移出视窗
        if (newX < 0) newX = 0;
        if (newX > maxX) newX = maxX;
        if (newY < 0) newY = 0;
        if (newY > maxY) newY = maxY;

        // 更新位置 
        this.position.x = newX;
        this.position.y = newY;

        // 更新鼠标初始位置，以便下一次计算
        this.initialMousePos = { x: event.clientX, y: event.clientY };
      }
    },
    // 停止拖拽事件处理函数
    stopDrag() {
      this.dragging = false;
      // 移除鼠标移动和鼠标释放事件监听
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.menu {
  position: absolute;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-toggler {
  position: relative;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 65px;
  /* Adjust as needed for your custom image */
  height: 65px;
  /* Adjust as needed for your custom image */
  z-index: 2;
  opacity: 0;
  cursor: pointer;
}

/* 中间按钮的样式 */
.custom-toggler {
  background-position: center;
  background-position-y: -2px;
  /* 水平和垂直居中 */
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 60px;
  height: 60px;
  background-size: cover;
  cursor: pointer;
  border-radius: 30%;
  z-index: 1;
}

.menu-toggler:checked~ul .menu-item {
  opacity: 1;
}

/* 第二个数据可以修改外围离中心按钮的距离 */
.menu-toggler:checked~ul .menu-item:nth-child(1) {
  transform: rotate(0deg) translateX(-80px);
}

.menu-toggler:checked~ul .menu-item:nth-child(2) {
  transform: rotate(72deg) translateX(-80px);
  /* Changed to 72deg for 5 items */
}

.menu-toggler:checked~ul .menu-item:nth-child(3) {
  transform: rotate(144deg) translateX(-80px);
  /* Changed to 144deg */
}

.menu-toggler:checked~ul .menu-item:nth-child(4) {
  transform: rotate(216deg) translateX(-80px);
  /* Changed to 216deg */
}

.menu-toggler:checked~ul .menu-item:nth-child(5) {
  transform: rotate(288deg) translateX(-80px);
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
  width: 60px;
  height: 60px;
  opacity: 0;
  transition: 0.5s;
  z-index: 1;
  ;
}

.menu-item a {
  display: block;
  width: inherit;
  height: inherit;
  line-height: 80px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  text-align: center;
  text-decoration: none;
  pointer-events: none;
  transition: 0.2s;
}

.menu-item:nth-child(1) a {
  transform: rotate(0deg);
}

.menu-item:nth-child(2) a {
  transform: rotate(-72deg);
  /* Changed to -72deg for 5 items */
}

.menu-item:nth-child(3) a {
  transform: rotate(-144deg);
  /* Changed to -144deg */
}

.menu-item:nth-child(4) a {
  transform: rotate(-216deg);
  /* Changed to -216deg */
}

.menu-item:nth-child(5) a {
  transform: rotate(-288deg);
  /* Changed to -288deg */
}

.menu-item a:hover {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  font-size: 45px;
}
</style>