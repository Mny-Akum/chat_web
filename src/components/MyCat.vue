<template>
  <nav class="menu" @mousedown="startDrag" :style="{ top: `${position.y}px`, left: `${position.x}px` }">
    <input type="checkbox" class="menu-toggler" id="menu_toggler" v-model="isMenuOpen" />
    <div class="custom-toggler" :style="{ backgroundImage: 'url(' + togglerImage + ')' }"></div>
    <ul>
      <li class="menu-item" v-for="(item, index) in menuItems" :key="index">
        <a :href="item.href" :style="{ backgroundImage: 'url(' + item.image + ')' }"></a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'MyCat',
  data() {
    return {
      position: { x: 100, y: 100 },
      initialMousePos: { x: 0, y: 0 },
      dragging: false,
      isMenuOpen: false, // 控制菜单的显示与隐藏
      togglerImage: require('@/assets/images/03.jpg'), // 自定义切换器的图片
      menuItems: [
        { href: '#', image: require('@/assets/images/02.png') },
        { href: '#', image: require('@/assets/images/02.png') },
        { href: '#', image: require('@/assets/images/02.png') },
        { href: '#', image: require('@/assets/images/02.png') },
        { href: '#', image: require('@/assets/images/02.png') },
      ],
    }
  },

  methods: {
    startDrag(event) {
      this.dragging = true;
      this.initialMousePos = { x: event.clientX, y: event.clientY };
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);
    },
    onDrag(event) {
      if (this.dragging) {
        this.position.x = this.position.x + (event.clientX - this.initialMousePos.x);
        this.position.y = this.position.y + (event.clientY - this.initialMousePos.y);
        this.initialMousePos = { x: event.clientX, y: event.clientY };
      }
    },
    stopDrag() {
      this.dragging = false;
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    }
  }
}

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
  position: absolute;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-toggler {
  position: absolute;
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

.custom-toggler {
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 80px;
  /* Adjust to fit your custom image */
  height: 80px;
  /* Adjust to fit your custom image */
  background-size: cover;
  background-position-y: 20vh;
  cursor: pointer;
  border-radius: 40%;
  z-index: 1;
}

.menu-toggler:checked~ul .menu-item {
  opacity: 1;
}

.menu-toggler:checked~ul .menu-item:nth-child(1) {
  transform: rotate(0deg) translateX(-110px);
}

.menu-toggler:checked~ul .menu-item:nth-child(2) {
  transform: rotate(72deg) translateX(-110px);
  /* Changed to 72deg for 5 items */
}

.menu-toggler:checked~ul .menu-item:nth-child(3) {
  transform: rotate(144deg) translateX(-110px);
  /* Changed to 144deg */
}

.menu-toggler:checked~ul .menu-item:nth-child(4) {
  transform: rotate(216deg) translateX(-110px);
  /* Changed to 216deg */
}

.menu-toggler:checked~ul .menu-item:nth-child(5) {
  transform: rotate(288deg) translateX(-110px);
  /* Changed to 288deg */
}

.menu-item {
  position: absolute;
  z-index: 1;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 80px;
  height: 80px;
  opacity: 0;
  transition: 0.5s;
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