<template>
<div id="chat_loading">
    <section v-show="isLoading">
        <div class="loader">
            <span style="--i:1;"></span>
            <span style="--i:2;"></span>
            <span style="--i:3;"></span>
            <span style="--i:4;"></span>
            <span style="--i:5;"></span>
            <span style="--i:6;"></span>
            <span style="--i:7;"></span>
            <span style="--i:8;"></span>
            <span style="--i:9;"></span>
            <span style="--i:10;"></span>
        </div>
    </section>
    <div v-show="isLoading" class="loader_text">
        <span v-for="(text,index) in text"
            :style="'--i:'+index"
        >{{text}}</span>
    </div>
</div>
</template>
<script>
export default {
    name:"ChatLoading",
    props:{
        text:{
            type:String
        },
        isLoading:{
            type:Boolean,
            default:false
        }
    }
}
</script>
<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#chat_loading{
    text-align: center;
    margin:1rem 0 3rem;
}
section{
    display: flex;
    justify-content: center;
    align-items: center;
    animation: animateBg 5s linear infinite;
}

@keyframes animateBg{
    0%{
        filter: hue-rotate(0deg);
    }
    100%{
        filter: hue-rotate(360deg);
    }
}

section .loader{
    position: relative;
    width: 2rem;
    height: 2rem;
}
section .loader span{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(calc(36deg * var(--i)));
}
section .loader span::before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: #00eeff;
    box-shadow: 0 0 1rem #00eeff,
                0 0 2rem #00eeff,
                0 0 4rem #00eeff,
                0 0 6rem #00eeff,
                0 0 8rem #00eeff,
                0 0 10rem #00eeff;
    animation: animate 1s linear infinite;
    animation-delay: calc(0.1s * var(--i));
}
@keyframes animate{
    0%{
        transform: scale(1);
    }
    80%,100%{
        transform: scale(0);
    }
}
.loader_text{
    margin-top: 1.5rem;
    font-size: 1.3rem;
    color: #00eeff;
    display: inline-block;
}
.loader_text span{
    margin-left: 0.5rem;
    animation: animateBg 5s linear infinite;
    text-shadow: 0.1rem 0.1rem 1rem #00eeff;
    animation-delay: calc(0.1s * var(--i));
}
</style>