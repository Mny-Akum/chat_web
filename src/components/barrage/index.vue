<template>
    <div id="barrage">
        <div class="input-container">
            <div id="InputAlice">
                <img src="./img/alxwxt.png"  alt="">
                <input type="text" class="danmuInput" placeholder="输入弹幕，最多20个字" v-model="barrageText" v-on:keyup.enter="sendBarrage"  maxlength="20">
            </div>
            <div id="Elysia">
                <input type="image" :src="require('./img/Elysia.jpg')" class="sendBtn"  style="color: #FFE791;" @click="sendBarrage" />
                <div class="btnText" >发送</div>
            </div>
        </div>
    </div>
</template>

<script>
import {getRandomNum} from '@/utils/utils'
export default {
    name:"barrage",
    props:["documentId"],
    data(){
        return{
            barrageText:"",
            audioList:[
                require("@/assets/audio/bbkb.mp3"),
                require("@/assets/audio/omg.mp3"),
                require("@/assets/audio/ss.mp3")
            ],
            barrageList:[]
        }
    },
    watch:{
    },
    methods:{
        playRandomAudio(){
            const audio = this.audioList[getRandomNum(0,this.audioList.length-1)]
            new Audio(audio).play();
        },
        sendBarrage(){
            this.addBarrage();
            this.barrageText = ""
            this.playRandomAudio()
        },
        addBarrage(){
            const container = document.getElementById(this.documentId)
            const barrage = document.createElement('div');
            barrage.classList.add('barrageItem');
            barrage.textContent = this.barrageText;
            // 随机颜色
            const randomColor = `#${getRandomNum(0,1677215).toString(16).padStart(6,'0')}`
            barrage.style.color = randomColor;
            // 随机位置
            barrage.style.top = `${getRandomNum(0,100)}%`
            container.appendChild(barrage)
        }
    }
}
</script>

<style lang="less">
#barrage{
    position: relative;
    width: 36rem;
    height: 7rem;
    backdrop-filter: blur(1rem);
    border-radius: 2rem;
    box-shadow: inset 0px 0px 1rem 0.2rem rgb(255, 255, 255, 0.5);
}
.input-container {
    text-align: center;
    padding-left: 3rem;
}
// 弹幕输入框
#InputAlice {
    display: inline-block;
    position: relative;
    img{
        width: 18rem;
        position: relative;
        top: -1.5rem;
    }
    .danmuInput{
        position: absolute;
        margin: 0 auto;
        left: -1rem;
        top: 3.3rem;
        background-color: rgba(245, 245, 220, 0.9);
        padding: 0.2rem;
        border-image: linear-gradient(to right, #686b80 50%, #efb181 50%);
        border-image-slice: 1; /* 使用整个渐变 */
        font-size: 1.5rem;
        outline-color: #efb181;
    }
}
//弹幕发送按钮
#Elysia{
    position: relative;
    display: inline-block;
    width: 5rem;
    height: 5rem;
    .sendBtn{
        width: 100%; /* 按钮图片填充父容器 */
        height: 100%;
        display: block;
    }
    .btnText{
        position: absolute; /* 绝对定位文字 */
        top: 50%; /* 纵向居中 */
        color: #f57e2f; /* 文字颜色 */
        left:50%;
        transform: translate(-50%,-50%);
        font-size: 1rem; /* 文字大小 */
        font-weight: bold; /* 文字加粗（可选） */
        pointer-events: none; /* 禁用鼠标事件，避免影响按钮点击 */
    }
    &:active{
        transform: scale(0.9); /* 按下时缩小到 90% */
        filter: brightness(0.95);
    }
}



.barrageItem-container {
    width: 100%;
}

.barrageItem {
    position: fixed;
    top: -500px;
    white-space: nowrap;
    font-size: 1.5rem;
    animation: barrage_move 10s linear infinite;
    z-index: 100;
}

@keyframes barrage_move {

    from {
        transform: translateX(4000%);
    }

    to {
        transform: translateX(-80%);
    }

}

</style>