<template>
  <div class="app">
    <nav class="menu">
      <input type="checkbox" class="menu-toggler" id="menu_toggler" v-model="isMenuOpen">
      <div class="custom-toggler" :style="{ backgroundImage: 'url(' + togglerImage + ')' }" @mousedown="startDrag"
        @touchstart="startDrag" ,:style="{ top: togglerTop + 'px', left: togglerLeft + 'px' }"></div>
      <ul v-show="isMenuOpen">
        <li class="menu-item" v-for="(item, index) in menuItems" :key="index">
          <a href="#">{{ item.label }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: cat,
  data() {
    return {
      isMenuOpen: false,
      togglerImage: './chat/src/assets/images/03.jpg',
      togglerPosition: { top: '50%', left: '50%' },
      togglerOffset: { x: 0, y: 0 },
      dragging: false,
      menuItems: [
        { label: 'Item 1' },
        { label: 'Item 2' },
        { label: 'Item 3' },
        { label: 'Item 4' },
        { label: 'Item 5' },
      ],
    };
  },
  computed: {
    togglerTop() {
      const { windowHeight } = this.getWindowDimensions();
      return `${(windowHeight / 2) - 40 + this.togglerPosition.top - this.togglerOffset.y}px`;
    },
    togglerLeft() {
      const { windowWidth } = this.getWindowDimensions();
      return `${(windowWidth / 2) - 40 + this.togglerPosition.left - this.togglerOffset.x}px`;
    },
  },
  methods: {
    getWindowDimensions() {
      const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
      return {
        windowWidth,
        windowHeight,
      };
    },
    startDrag(event) {
      this.dragging = true;
      this.togglerOffset = {
        x: event.clientX - (this.togglerPosition.left || (window.innerWidth / 2) - 40),
        y: event.clientY - (this.togglerPosition.top || (window.innerHeight / 2) - 40),
      };
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);
      document.addEventListener('touchmove', this.onDrag, { passive: false });
      document.addEventListener('touchend', this.stopDrag);
    },
    onDrag(event) {
      if (this.dragging) {
        const { windowWidth, windowHeight } = this.getWindowDimensions();
        let newLeft = event.clientX - this.togglerOffset.x;
        let newTop = event.clientY - this.togglerOffset.y;

        // Snap to edges
        if (newLeft < 20) newLeft = 20;
        if (newTop < 20) newTop = 20;
        if (newLeft > windowWidth - 100) newLeft = windowWidth - 100;
        if (newTop > windowHeight - 100) newTop = windowHeight - 100;

        this.togglerPosition = { top: newTop, left: newLeft };
      }
    },
    stopDrag() {
      this.dragging = false;
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDrag);
      document.removeEventListener('touchmove', this.onDrag);
      document.removeEventListener('touchend', this.stopDrag);
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

body {
  background: linear-gradient(to right, #ed6ea0, #ec8c69);
  height: 100vh;
  overflow: hidden;
}

.app {
  position: relative;
  width: 100%;
  height: 100%;
}

.menu {
  position: relative;
  width: 100%;
  height: 100%;
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
  width: 40px;
  height: 40px;
  z-index: 2;
  opacity: 0;
  cursor: pointer;
}

.custom-toggler {
  position: absolute;
  display: block;
  width: 80px;
  height: 80px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border-radius: 40%;
  z-index: 1;
  pointer-events: auto;
}

.menu-toggler:checked~ul .menu-item {
  opacity: 1;
}

.menu-toggler:checked~ul .menu-item {
  position: absolute;
  display: block;
  width: 80px;
  height: 80px;
  opacity: 1;
  transition: 0.5s;
  transform-origin: center;
}

.menu-toggler:checked~ul .menu-item:nth-child(1) {
  transform: rotate(0deg) translateX(-110px);
}

.menu-toggler:checked~ul .menu-item:nth-child(2) {
  transform: rotate(72deg) translateX(-110px);
}

.menu-toggler:checked~ul .menu-item:nth-child(3) {
  transform: rotate(144deg) translateX(-110px);
}

.menu-toggler:checked~ul .menu-item:nth-child(4) {
  transform: rotate(216deg) translateX(-110px);
}

.menu-toggler:checked~ul .menu-item:nth-child(5) {
  transform: rotate(288deg) translateX(-110px);
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

.menu-item a:hover {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  font-size: 45px;
}
</style>