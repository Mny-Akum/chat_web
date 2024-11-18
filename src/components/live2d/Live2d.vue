<template>
  <div>
    <div >
        <div id="tooltip" style=" position: fixed;display: block; padding: 10px; background: rgba(0, 0, 0, 0.8); color: white; border-radius: 5px; z-index: 100000;right: 15px;top: 250px;">
            大家好啊，欧内的手
        </div>
            <div id="live2d" class="live2d-widget-container" style="position: fixed; right: -40px; bottom: -50px; width: 300px; height: 600px; z-index: 99999; opacity: 1;">
            <canvas id="live2dcanvas" width="600" height="1200" style="position: absolute; left: 0px; top: 0px; width: 300px; height: 600px;"></canvas>
        </div>
    </div>
  </div>
</template>

<script>

import {L2Dwidget} from 'live2d-widget'
export default {
    name:"Live2D",
    data(){
        return{

        }
    },
    mounted(){
        this.init()
    },
    methods:{
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
        }
    }
}
</script>

<style>

</style>