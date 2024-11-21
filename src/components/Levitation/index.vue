<template>
  <div :style="{ width, height, left: levItem?.left, top: levItem?.top,backgroundImage: `url(${encodeURI(personalHomepage.avatar)})` }"
    class="all" :class="personalHomepage.online ? 'openCss' : 'outCss'" ref="alls">
    <div style="width: 100%; height: 100%;position: relative;box-sizing: border-box;">
      <img :src="personalHomepage.avatar" class="avatarCss">
      <div class="avatarCss avatarpian" :class="personalHomepage.online?'onSpanCss':''">
        <!-- 在线显示 -->
      </div>
      <div class="box1">
        <span class="item" style="font-size: 1.8rem;">{{ personalHomepage.username }}</span>
        <span class="item" style="font-size: 1rem;">{{ personalHomepage.online ? '在线' : '离线' }}</span>
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
    // console.log(this.levItem.personalHomepage)
    let suns=this.$refs.alls.offsetHeight/1.5
    this.levItem.top=this.levItem.top- suns+'px'
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
  border-bottom: 0.3rem solid rgb(174, 210, 255);
}
.avatarCss {
  height: 8rem;
  width: 8rem;
  margin: 1rem;
  box-sizing: border-box;
  position: absolute;
  z-index: 2;
}
.avatarpian{
  height: 8.2rem;
  width: 8.2rem;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 0.4rem 1.2rem;
  background: linear-gradient(120deg, #77767688 0%, #f4f6f8b6 100%);
  backdrop-filter: blur(3rem);
  z-index: 1;
}
.box1 {
  width: 10rem;
  height: 5rem;
  float: right;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
}

.item {
  margin-top: 0.2rem;
  margin-left: 0.2rem;
}

.box {
  width: 100%;
  position: absolute;
  height: 18rem;
  top: 7rem;
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