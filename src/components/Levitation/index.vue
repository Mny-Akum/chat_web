<template>
  <div :style="{ width, height, left: levitem?.left, top: levitem?.top, backgroundImage: `url(${encodeURI(PersonalHomepage.avatar)})` }"
    class="all" :class="PersonalHomepage.online ? 'opencss' : 'outcss'">
    <div style="width: 100%; height: 100%;position: relative;box-sizing: border-box;">
      <img :src="PersonalHomepage.avatar" class="avatarCss">
      <div class="avatarCss avatarpian" :class="PersonalHomepage.online?'onspancss':''">
        <!-- 在线显示 -->
      </div>
      <div class="box1">
        <span class="item" style="font-size: 20px;">{{ PersonalHomepage.username }}</span>
        <span class="item" style="font-size: 10px;">{{ PersonalHomepage.online ? '在线' : '离线' }}</span>
      </div>
      <div class="box">
      </div>
    </div>
    <audio  ref="nailong" >
    </audio>
  </div>
</template>
<script>
import { onMounted } from 'vue';

export default {
  name: "Levitation",
  props: ['levitem', 'height', 'width'],
  data() {
    return {
      PersonalHomepage: {},
    }
  },
  methods: {
  },
  mounted() {
    // console.log(this.levitem.PersonalHomepage)
    this.PersonalHomepage = this.levitem.PersonalHomepage
    if(this.PersonalHomepage.email=='shenmidadazaoan@qq.com'){
      this.$refs.nailong.src=require('@/components/Levitation/mp3/汪旭专属.mp3')
    }else{
      this.$refs.nailong.src=require('@/components/Levitation/mp3/漫步01.mp3')
    }
    this.$refs.nailong.play()
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
.onspancss{
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
.avatarpian{
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
.opencss {
  color: rgb(68, 172, 232);
}

/* 离线字体 */
.outcss {
  color: rgb(107, 99, 99);
}
</style>