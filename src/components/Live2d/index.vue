<template>
  <div>
    <!-- Tooltip 信息 -->

    <!-- Live2D 模型 -->
    <div :class="['live2d-widget-container', { 'show': isVisible }]" id="live2d" @mouseover="tooltipVisible=true" @mouseout="tooltipVisible = false">
      <div id="tooltip" v-if="tooltipVisible">
        大家好啊，欧内的手
      </div>
      <div class="bu" id="b1" @click="scrollPage">₯</div>
      <canvas id="live2dcanvas" width="600" height="1200" style="position: absolute; left: 0px; top: 0px; width: 300px; height: 600px;"></canvas>
    </div>
  </div>
</template>


<script>
import {L2Dwidget} from "live2d-widget"
export default {
  data() {
    return {
      isVisible: false,  // 控制 Live2D 是否可见
      tooltipVisible:false
    };
  },
  mounted() {
    // 页面加载完成后启动动画
    setTimeout(() => {
      this.isVisible = true;  // 修改状态为 true，触发动画
      this.init()
    }, 500); // 延迟500毫秒后启动动画
  },
  methods: {
    // 这里可以添加其他方法
    init(){
        L2Dwidget.init({
            model: {
                // 模型文件
                jsonPath: "/live2dw/live2d-widget-model-z16/assets/z16.model.json",
                scale: 1 //模型缩放比例
            },
            display: {
                position: "right", //模型的位置（左or右）
                width: 300, //模型宽度
                height: 600, //模型高度
                hOffset: -30, //模型水平偏移量
                vOffset: -50 //模型垂直偏移量
            },
            mobile: {
                show: true, //手机端是否显示
                scale: 1 //缩放比例
            },
            react: {
                opacity: 1 //模型不透明度
            },
        })
    },
    scrollPage(){
      let top = window.scrollY;
      let pageHeight = window.innerHeight
      let scrollDistance;
      if(top > pageHeight/2){
        scrollDistance = 0;
      }else{
        scrollDistance = pageHeight
      }
      window.scrollTo({
        top:scrollDistance,
        behavior:"smooth"
      })
    }
  }
};
</script>

<style scoped>
/* 初始状态：模型在页面底部外面 */
#live2d {
 position: fixed;
  right: -40px;
  bottom: -650px; /* 初始位置在页面底部外面 */
  width: 300px;
  height: 600px;
  z-index: 99999;
  opacity: 1;
  transition: bottom 2s ease-out; /* 动画效果：慢慢升起 */
  text-align: center;
}

/* 页面加载完成后，动画将模型从底部升起 */
#live2d.show {
  bottom: -50px; /* 模型最终位置 */
}
.bu {
    position: absolute;
    display: inline-block;
    left: 50%;
    transform: translateX(-50%);
    bottom: 95px;
    font-weight: 900;
    font-size: 35px;
    z-index: 50000;
    /* 设置鼠标为点击状态，并取消可框选 */
    cursor: pointer;
    user-select:none;
}
#tooltip{
  /* 让文字框居中 */
  position:absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 60px;
  display: inline-block;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 5px;
  z-index: 100;
}
</style>
