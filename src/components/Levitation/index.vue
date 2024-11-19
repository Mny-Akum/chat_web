<template>
  <div :style="{ width, height, left: levItem?.left, top: levItem?.top, backgroundImage: `url(${encodeURI(personalHomepage.avatar)})` }"
    class="all" :class="personalHomepage.online ? 'openCss' : 'outCss'">
    <div style="width: 100%; height: 100%;position: relative;box-sizing: border-box;">
      <img :src="personalHomepage.avatar" class="avatarCss">
      <div class="avatarCss avatarpian" :class="personalHomepage.online?'onSpanCss':''">
        <!-- 在线显示 -->
      </div>
      <div class="box1">
        <span class="item" style="font-size: 20px;">{{ personalHomepage.username }}</span>
        <span class="item" style="font-size: 10px;">{{ personalHomepage.online ? '在线' : '离线' }}</span>
      </div>
      <div class="box">
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "Levitation",
  props: ['levItem', 'height', 'width'],
  data() {
    return {
      personalHomepage: {},
    }
  },
  methods: {
  },
  mounted() {
    this.personalHomepage = this.levItem.personalHomepage
  },
  computed:{
  },
  methods:{
  }
}

</script>
<style scoped>
.all {
  position: absolute;
  z-index: 1;
  overflow: hidden;
  background-size: 100% 100%;
}
.onSpanCss{
  box-sizing: border-box;
  border-bottom: 3px solid rgb(174, 210, 255);
}
.avatarCss {
  height: 80px;
  width: 80px;
  margin: 10px;
  box-sizing: border-box;
  position: absolute;
  z-index: 2;
}
.avatarPian{
  height: 82px;
  width: 82px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;
  background: linear-gradient(120deg, #77767688 0%, #f4f6f8b6 100%);
  backdrop-filter: blur(3rem);
  z-index: 1;
}
.box1 {
  width: 100px;
  height: 50px;
  float: right;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.item {
  margin-top: 2px;
  margin-left: 1px;
}

.box {
  width: 100%;
  position: absolute;
  height: 200px;
  top: 70px;
  background: linear-gradient(120deg, #e0c3fc88 0%, #8ec5fc88 100%);
  backdrop-filter: blur(0.3rem);
}

/* 在线字体 */
.openCss {
  color: rgb(68, 172, 232);
}

/* 离线字体 */
.outCss {
  color: rgb(107, 99, 99);
}

</style>