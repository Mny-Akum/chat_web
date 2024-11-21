<template>
    <div id="barrage">
        <div class="input-container">
            <div id="InputAlice">
                <img src="./img/alxwxt.png"  alt="">
                <input type="text" class="danmuInput" placeholder="输入弹幕">
            </div>
            <div id="Elysia">
                <input type="image" :src="require('./img/Elysia.jpg')" class="sendBtn"  style="color: #FFE791;" />
                <div class="btnText">发送</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"barrage",
    data(){
        return{}
    }
}
</script>

<style lang="less" scoped>
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



.danmu-container {
    width: 100%;
}

.danmu {
    position: absolute;
    top: -500px;
    white-space: nowrap;
    font-size: 23px;
    animation: danmuMove 10s linear infinite;
    z-index: 100;
}

@keyframes danmuMove {

    from {
        transform: translateX(4000%);
    }

    to {
        transform: translateX(-80%);
    }

}


label,
textarea {
    font-size: 0.8rem;
    letter-spacing: 1px;
} 

#story {
    position: relative;
    width: 100%; /* 根据需要调整宽度 */
    height: 150px; /* 根据需要调整高度 */
    background: url('./img/Lion.png') no-repeat right bottom; /* 图片放置在右下角 */
    backdrop-filter: blur(5px);
    background-size: 150px 100px; /* 调整图片大小 */
    padding: 10px; /* 确保文字不覆盖图片 */
    resize: none; /* 可选：禁止用户调整文本域大小 */
}

textarea {
    padding: 10px;
    max-width: 100%;
    line-height: 1.5;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 1px #999;
}

label {
    display: block;
    margin-bottom: 10px;
}

.text {
    position: absolute;
    left: 100px;
    top: 320px;
}
</style>