<template>
  <div>
    <div class="bg">
        <!-- 个人封面 -->
        <Live2d/>
        <!-- 模糊背景 -->
        <div class="banner">
            <div class="user-cover">
                <label for="cover-upload" class="button">
                    <svg t="1731836452494"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="910">
                        <path d="M128 853.333333h768.064L896 170.666667H127.936L128 853.333333zM127.936 128h768.128C919.594667 128 938.666667 146.986667 938.666667 170.666667v682.666666c0 23.573333-19.029333 42.666667-42.602667 42.666667H127.936A42.56 42.56 0 0 1 85.333333 853.333333V170.666667c0-23.573333 19.029333-42.666667 42.602667-42.666667z m200.128 527.082667c22.890667-19.626667 68.48-36.416 98.794667-36.416h20.949333c40.533333 0 95.914667-20.437333 126.549333-46.698667l52.373334-44.885333c22.890667-19.626667 68.48-36.416 98.794666-36.416H810.666667a21.333333 21.333333 0 0 0 0-42.666667h-85.12c-40.533333 0-95.936 20.437333-126.570667 46.698667l-52.373333 44.885333C523.690667 559.210667 478.165333 576 447.786667 576h-20.949334c-40.490667 0-95.914667 20.437333-126.549333 46.698667L199.445333 709.12a21.333333 21.333333 0 1 0 27.776 32.384l100.842667-86.442667z" fill="#ffffff" p-id="911"></path>
                        <path d="M352 373.333333m-53.333333 0a53.333333 53.333333 0 1 0 106.666666 0 53.333333 53.333333 0 1 0-106.666666 0Z" fill="#ffffff" p-id="912"></path>
                    </svg>
                    <span>上传封面图片</span>
                </label>
                <!-- 隐藏的文件上传控件 -->
                <input type="file" id="cover-upload" style="display: none;" accept="image/*" />
            </div>
            <div class="fixed-frame">
                <!-- 左侧的圆形头像框 -->
                <div class="profile-circle" onclick="document.getElementById('fileInput').click();">
                    <span>更换头像</span>
                </div>
                <!-- 隐藏的文件选择器 -->
                <input type="file" id="fileInput" class="file-input" accept="image/*" onchange="handleFileChange(event)">
            </div>
        </div>
        <!-- 第一页下面功能区 -->
        <div style="display:flex;justify-content: space-between;">
            <!-- 左边功能列表 -->
            <div class="toolCabinet">
            <!-- SignIn -->
                <div class="signIn">
                    <div class="login">
                        <div class="signImage">
                            <img src="@/assets/images/user_sign.gif" alt="" />
                        </div>
                        <!-- 签到按钮 -->
                        <div class="sign-button">
                            <div class="sign-button-big">
                                <button class="sign-button-small" id="signs">签到</button>
                            </div>
                        </div>
                        <!-- 签到记录 -->
                        <div class="sign-logs" style="display: none;" id="signLogs">
                            <span>已连续签到<span id="signTimes">1</span>次，<a href="../indexMenus/signlogs.html">我的签到记录</a></span>
                        </div>
                    </div>
                </div>
                <MusicPlayer/>
            </div>
            <!-- 右边功能 -->
            <ChatCalendar style="margin-top:2rem;"/>

        </div>
    </div>
  </div>
</template>

<script>
import Live2d from "@/components/live2d/Live2d.vue"
import MusicPlayer from "@/components/music/MusicPlayer.vue"
import ChatCalendar from '@/components/chatCalendar/ChatCalendar.vue'
export default {
    name:"UserPage",
    data(){
        return {
            
        }
    },
    components:{MusicPlayer,Live2d,ChatCalendar},
    mounted(){
        document.documentElement.style.fontSize = document.documentElement.clientHeight / 957 * 12 + 'px'
    }
}
</script>

<style lang="scss" scoped>
*{
    box-sizing: border-box;            
    margin: 0;
    padding: 0;
}
.bg {
    padding-left:15vw;
    padding-right: 14vw;
    // overflow: hidden;
    height: 200vh;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url(@/assets/images/user_bg_light.jpg) no-repeat 0% 20%/cover;
    position: relative;
    background-size: cover;
    background-attachment: fixed;
}
.toolCabinet{
    height: 54.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.user-cover {
    position: absolute;
    top: 1.6rem;
    right: 2rem;
    z-index: 11;
    .button {
        display: inline-flex; /* 使用 Flexbox 布局 */
        align-items: center; /* 垂直居中对齐 */
        justify-content: center; /* 水平居中对齐 */
        gap: 0.4rem; /* 图标与文字之间的间距 */

        border: 1px solid white;
        border-radius: 1rem;
        padding: 0.3rem 0.6rem;
        span {
            font-size: 1.2rem;
            color: white;
        }
        svg{
            width:1.5rem; 
            height:1.5rem;
        }
        &:active {
            transform: translateY(2px); /* 点击时下沉 */
            box-shadow: 0 2px 5px rgba(255, 255, 255, 0.2); /* 阴影变小 */
        }
    }
    
}

.banner {
    width: 70vw;
    height: 26.5rem;
    background-image: linear-gradient(to right top, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.9));
    /* backdrop-filter: blur(5px); */
    background-position: center; /* 居中显示背景图片 */
    margin: 0 auto; /* 水平居中 */
    position: relative;
    border-radius: 1rem;
    .fixed-frame {
        width:initial;
        height:19rem;
        background-image: url(@/assets/images/user_head_default.png) !important; /* 背景图 */
        background-size: cover; /* 覆盖整个框架 */
        background-position: center; /* 居中显示背景图片 */
        margin: 0 auto; /* 水平居中 */
        position: relative;
        display: flex;
        align-items: center;
        padding-left: 2rem; /* 调整圆形的位置 */

        .profile-circle {
            width: 8rem; /* 圆的直径 */
            height: 8rem;
            backdrop-filter: blur(3rem);
            border-radius: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            cursor: pointer;
            margin-top: 18.5rem;
            margin-left: 2rem;
            // 隐藏的文字
            span {
                color: white;
                font-size: 1.2rem;
                display: none;
            }
            /* 悬停显示文字 */
            &:hover span {
                display: block;
            }
        }
         /* 隐藏文件选择器 */
        .file-input {
            display: none;
        }
    }
}
.signIn{
    .login{
        backdrop-filter: blur(5rem);
        width: 36rem;
        height: 20rem;
        box-shadow: 0 2px 1px rgba(0, 0, 0, 0.2), 0 3px 1px #fff;
        border-radius: 1rem;
        overflow: hidden;
        .signImage {
            overflow: hidden;
            height: 13rem;
            img{
                margin: 1rem 1rem 0;
                width: 34rem;
                border-radius: 1rem;
                z-index: 11;
            }
        }
        .sign-button {
            width: 100%;
            height: 15vh;
            text-align: center;
            margin-top: 1%;
            .sign-button-big {
                margin: 0 auto;
                width: 6.5rem;
                height: 6.5rem;
                /* margin: 0 auto; */
                border-radius: 50%;
                background-image: linear-gradient(to right top, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
                color: white;
                padding: 0.6rem;
                .sign-button-small {
                    font-size: 1.2rem;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: pink;
                    color: white;
                    border: 0;
                    cursor: pointer;
                    &:hover {
                        color: black;
                        background-color: #ffeded;
                    }
                }
            }
        }
        .sign-logs {
            width: 98%;
            height: 8vh;
            margin-left: 1%;
            text-align: center;
            font-size: 12px;
            line-height: 6vh;
            position: absolute;
            top: 235px;
            &>span>a {
                color: #436eee;
            }
        }
    }
}


</style>                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               
                                                                |||                                                               |||                                                                                                                                                                                                          
                                                                 ||                  |||                                           ||                                           |||                                                                                |    ||               |                            |||                      
                       ||||                    |||               ||                   ||  |                     |||                ||                                         |||||                                            |                    ||             ||   |||              ||                  ||  |||||||||                  |||
                |||||||||||          |||  |    |||               || |||           ||| ||  |||            |||||||||||               || |||           ||    |||              |||||  |||                |||||||||         |||     ||            | ||||||||            ||   ||               |||||               ||   |||||||          ||||||||||||
               |||||||                ||| |||  ||             || ||  |||          ||| ||   ||        ||||||| ||  ||             || ||  |||          |||    |||             |  ||  ||         |||||||||||||||||         |||    |||        |||||||||  |||           |||  |||              ||| |||  ||          ||   |||| ||          |||||||  |||
                    ||                 ||  || ||             ||||||   |           ||   |              ||||   ||  ||            ||||||   |            ||    ||              || || ||          |||||                     ||     ||         ||| |||||  ||            ||   || |||||         || | ||||||||        ||||  |||||             |     ||| 
                    || ||                    |||           |||||  |  |           |||   || |||           ||   ||  ||          |||||  |  |                   ||               |  |||  ||            ||     ||           ||  || ||  |        || || ||||||           ||    ||||||||        ||| ||  |  |||     || ||||  |||||                  ||   
                 |||||||||            |  |||||||||            ||  |||||          ||    ||||||          ||    ||  ||             ||  |||||                  ||            |  ||||||||||||      ||||||| ||||||          || ||| |  |||       ||||| ||| ||          ||||  ||||  |||        ||  ||     ||      |||||| |||  |||               |||    
                 |||||  ||           ||| |||   ||             |||||||           ||||  |||||           |||||  || ||              |||||||            ||||    || |||        |||||||    ||||       ||  || ||  ||         |||||||||||||         ||   || ||||         |||| || |   |         |||| ||     ||       |||   ||||||||               |||    
                 || ||  ||       |||||||  ||   |          ||||||| || |||       ||||||||||             |||||| |  |||||       ||||||| || |||      ||||||     ||||||       ||   ||||||||          ||  || ||  ||         |||||  || ||           ||  ||||| ||       || || |  ||||         ||||| ||     ||       |||   ||| |||||               ||    
                 |||||||||        ||| ||  |||||||         ||||||   | |||       || |||   ||            ||  ||||||||||||      ||||||   | |||      ||||||     |||          ||||||||||             ||  || ||  ||           ||     ||         || |||||||  |||      ||  ||     ||         ||| || ||     ||         |  ||||||||||               ||    
                 |||||  ||            |   |||||               |||| ||||       ||  ||    ||           ||| || |||    |||          |||| ||||           ||     ||           |   ||  |||            |||||| ||||||          || ||| || ||       || ||| |||||||           || |   ||||       |   || ||     ||        ||| ||||| ||                 ||    
                 || ||  ||||||       ||  | ||||             ||||   |||       ||   ||    |||         || ||||        ||         ||||   |||            || ||  ||               ||||||||           |||||| ||||||         |||||| |||||||       | ||  || ||             || ||  || |||         || ||     |||       |||| || ||||||               ||    
               ||||||||||||||||      ||||||| ||         ||||||||   |||            ||     ||    |   ||| |        |||||     ||||||||   |||            ||||   ||              ||||  ||            ||  || ||  ||         |||    ||            | ||||||  ||            |||||  || |||         || ||     |||       || |||  ||||||||             ||    
            |||||||     ||           |||| || ||     |   ||||  || ||||||   |       ||     |||   |   ||  |  |||||||||||     ||||  || ||||||   |       |||    ||             ||  ||||            |||| || ||  ||                   |||||      ||||| ||  ||||          ||||   ||  |||        || ||     |||      ||  |||| |||  |||||           ||    
                 ||     ||           ||| ||  ||     |       | |||||  ||  ||      |||      ||| ||          ||||     ||         | |||||  ||  ||      |||     |||||||       |||   |||            || |||||||||||         ||||||||||||||||   |||||   || ||||||||      ||||| | ||   ||       ||||||     |||     || ||| ||||||||                ||    
                ||      ||          ||| ||   ||    ||       ||||      |||||      |||       |||||                |||||         ||||      |||||      || |||||||||||||     ||| ||||||||           |  || ||  |||       ||||||||||||||||||   |||     ||||  ||||||     |||   ||||            ||| ||   |||||    ||  |  ||| || |||            |||||    
                ||    ||||           ||||    ||||||||        ||       |||||       |         ||||                 |||           ||       |||||      ||  ||              || |||||  ||||||||                |||        ||                         ||||               |     |||             || |     |||               |||  ||             ||||    
                ||    ||||                    ||||||          |        ||||       |          |||                 |||            |        ||||                                      |||||                  |                                    |||                       |                       |||               ||                   ||     
                       ||                                                ||                                       |                        ||                                                                                                  ||                                                                   |                   |      
        GGEEEEEKK#GGEGGLLGGEEEEGEGEEEEEEKWEEEEEEEEEEEEWGEEGEEEGGEEEGEEEGEEEEEEEKEEGGKKKKKEEEEEEjjW  WE
     KjEEEEWKEEEGGGGLLLLGEEELEEEEEEEEEKGGEEEEEEEEEEEKGGGEEEGEEEEGEEWEEEEEEEEGEGGEEEWKKKKEEEEEEjG #GW
    ttKEEEEEEEWEEEEEGLLLLGGG#GGGEEEEEEKGEEEEEEEGEEEGEEGEEEKEEEEEEEEEGEEEEEEGGGGEEEEWKKKKKEEEEEjG#KK 
    GEKEEEWEKEEEEGGGGLLLLGLLEGGGGGEEGK#GEEEGGGEEEEEEEEGGGEEGGGEGGGGEWGEGEEGGGGGEGGEE#KKKWEEEEEEjG#  
   #jEKEG#EEKGEEEGKGGLGLLLLjLGGGGGEGEKGGEEEGGGEEEEEEEGGGGGEGGGEGGGEGEGGEGGGLLLKGGEGEE#KKKKEEEEEjEW  
   jKEEEGKEEWGEGGGGGGLGLLGWjjjLGGGGEE#jGEGGGEEEEEEEEEEGGGGGKGGGGGGGWEEGEGGLLLLWGEGGGKEWKKWEEEEEELW  
  WjEEEE#EEKEGGKGGGGGLLLLLjjjjjjGGGE#jjGGGGGGGGGGGGGGKGGGGGGGGGGGGGGE#GGLLLLLLGGGGGGEE#KKKKEEEEEjL# 
 KjKEEGEKEEWEGELEGGGGGLLjKjjjjjjjLLE GjGGGGGGGGGGGGGGWGGGGGEKEGGGGGGWKLLLLLLLGLGGGGGEEGWKKWEEEEEEE#W
 tjEGEGWEEEGGGKGEGGGGGLLLjjjjjjjjjLi,EjLGGGGGGGGGGGGGGGGGGGEGGGGGGGGLELLLLLLGGGEEGGGGGWWKKKEEEEEEEKW
#LEGEEGWEEKGGGGGEGGGGGGLWjjjjjjjjj#, #jjGGGGGGGGGGGGLjLGGGGGGKGGGLLLLEKLjLLLGGGKGGGGGGEEKKKWEEEEEGEW
LEGGGGEEKWGGGGGEGGGGGGGLLjjjjjjjjji  WjjjLGGGGGGGGGGjjLGGGGLLjLLjjjjLjWLGLGGGGGWEGEGGGGGWKKWEEEEEEWK
jGGGEEWEEEGGGKEGEGGGGGGGLjjjjjjjjLi  WjjtLGGGGGGGGGGjjELLLLjjjKLLjjjjLGLGLGGGGGKGEGGGGGGWKKKEEEEEEWG
LGEEEGKEKEGGEGEGGGGGGGLGLLjjjjjjKj   EjjjjjLGGGGGGLjjjGjjjjjjjjKLjjLjLjKGLGGGGGEGGEGGGGGGWKWKKEEEEWG
EEGGGKGEKEGGEGEGGGGGGGLGGLLjjjjLL    GjjtjttjjGGGLttjjjjjjjjjjjjGjjjLjLWLLGGGGGGGGEEGEGGGKKW#EKEEKWG
GGGGEWEEGGGGGGGGGGGGGGEGGGLLjjjji    GjjttttjjjjjttttjjjjjjjjjjjLtjLjLLGLGGGGGGGGGGGEGGGGEWKKEEEEWWG
GGEGGKEWGGGEGGGGGGGGGGEGGGGLjjj,     LjjttttttttttttjjLjjjjjjjjjtLjjLLGGjGGGGGGGGGGGGGGGGGEKKEEKKWWE
GGEGGEEEGGGEGKGGGGGGGLGGGGGLLjGL     LjjttttttttttttjjjtjjjjjjjjjjWjLLGGLGGGGGGGGGGGGEGGGGGWWKEEWWWE
GGGGEEEGGGGGGGGGGGGGGGGGLGGLLjiE     LjttttttttttttttjjjjjjjjjjjjjLKGGGGWGGGGGGGGGGGEEEGGGGGK#EWWWWK
GEGGKE#GGGEGELGLLLGGGEGGGGLLLK       LttjttttttttttttjLEtjjjjjLLLLLLEGGGWGGGGGGGGGGGGGGGGGGEWWKWWWKK
GEGE#EEGGGEEKGLLLLGGGGGGGGLLLij      GjtjtttttttttttjLL,jjjjjLLLLLLLLEGGEGGGGGGGEGGGGGGGEGGEEKWWWWGK
GEGG#EGGGGGGGGLLLLGLGGGGGGGGG W      GjjjttttttttttttLLtGjjjLLLLLLLLLLEGLGGGGGGGKGGGGGGGGEGEGKWWWWLK
GGGGKWGGGKGGGLLLLLGGGGGGGGGGi .      KLjjjtttttttttjjLLEtjLLGLLLLLLLLLLGLLGGGGGGKGGGGGGGGGGEEWWWWWLK
GGGGEKGGGEGGGLLLLLEGGGGGGLLK ,       WLLLLtttttttjjjjLLK.LGLjLLLLLLLLLLLLGGGGGGGWEKGGGGGGGGGEGWWWWGW
GGGEEGGGGGGKGLLLLGGGGGGGGLG, #       #LLLLjttttttjjjjLLW.KLGLLLLLLLLLLLLL#GGGGGGWGGGEGGGGGGEGE#WWWKK
EGGGEGGGGGGKGLLLLLLGGGGGGLW  j       KLLLLLjtttttjjjjLLW. GWjLGLLLLLLLLLL#GGGGGGWGGGKGGEEEGEEEKWWWWW
KGGEEGGGKGGKGLLLLLLLGGGGGLi L        LLLLLjLjttttjLjjLLK, EjLjLGLLLLLLLLL#LGGGGGWGLGGGEGGEGGGEEWWEWW
KGGEWGGGEGGGGLLLLLLLGGGGLGi K        .LLLLjjLjttjjjjjLLE.  KLELLjLLLLLLLLWLLGGGG#GEGGGEEGGGGGGGWWEWW
EGGEWGGGGGGGGLLLLGLLGGGLjL            jLLjjjjjtjjjLjjjLG.   GEEjjLLLLLLLLKLLLLGGWGGGGGGGGGGGEGKWWEWW
GGGEEGGGGGGGLLLLLELLGGLLL, t          LjjjjjjjjjjjjjjjjG.    t,GLELLLLLLLKGGLLGGWGGGLGGGGGGGGGGWKKWW
EGGGGGGGGGGGLLLLLELGLLLLE. E          jjjjjjjjjjjjjjjjjj.    LWiGjGLLLLLGKELLLLLKGGGGGGGGGGEGGGWWWWW
GGGGGGGKGGEGLLLLLGLGLLLL,  .          Ljjjjjjjjjjjjjjjjj      KW.EGGjLLLLKWLLLLLEGGGGGGGGGEGGGGWWWWW
GGGEGGGGGGKLLLLLLLLGLLLE, j           Kjjjjjjjjjjjjjjtjj       iK.KLLLLLLE#jLLLLEGGGGGGGEGGGGGGWWKWW
GGGWGGGGGGKGLLLLLLjGLLLt  E           Ljjjjjjjjjjjjjjtjj.        L.WLLLLLE#LLLLLEGGGLWLEGGGGGGKWWWWW
GGGWLGGGGLKGLLLLLLjGLLL.  i            jjjjjjjjjjjjjjtjjj        .jLEjLLLGKLLLLGGWKELEGGGGGGGEEWWWWW
GGGKGGGLLLKGLjLjLLjGLLEi t             jjjttjjjjjjjjtLjjE          WjijLELKjLLLLEGGGGGGGGGGGEGGWWWWW
GGGGGGGGLGELLjjjGLjGLLK  G             tttjjjjjjjjjjtGjjK            LLWGjEELLLLEGGLGGGGGGGKGEKWWWWW
GGGGGGEGLGGLjjLLELjLLj. ,.             LjttttttttttttGjjE             .#tLLKLLLLKLLGGGGGGGEGKKKWKKKW
GGGGGLKGGLGLjjLjGLjLjj, G              KtttttttttttttGjtL               .itWLLLLKGLLLGLLWGGKWKKWKKKW
GGEGGLKLLGLLjjjjGLtLjW, t              .ttttttttttttttttt                 .#jLLLKEEEEGGGEKKEGGKWKKKK
GGKGGGGGLGGLjjjjGjjLjt t#               ttttttttttttttttt                 i#jLLLKKKKKKKKELEGGGWWKKKK
GGKGGLGLLGGLjjjjLjjLL  G  #             Ktttttttttttttttt              ii  WjLLLW LLLLKGEGGGGGEWKKKW
GGGGGLLLLGGLjjjjLjtL#       W           ittttttttttttiitt           .#     KjLLLW jGLLLEGGGGGGGWKKK#
GGLGGLLGLGGjjjjjLjtjt G      GL          ttttttiittitiitt         GK       ELLLLW  LLLLGEKLGGGGWEEKW
GGGGGGLGLGGjjjjjLjjL  i        KL        itttiiiiiitiittt,      Gj         jjLjLW  GLLLLLLELGGGKEEKW
GGLLLGLGLGGjjjjjLjjL t           GE      WttiiiiiiiiiitiiG   GE            ijLLLW  tLLGLLLGELGGEEEEW
GELGLGLELGGjjjjjLtLE t             LW     tiitiiiiiiiijitELK,              .jLLLW   LLLGLLLLEGGEEEEW
GELGLLLKLGGjjjjjjtE L                EL   iiiiiiiiiiiitiiE                  jLLj#  tLLLLLKGGGGGEEEEW
GELEGGLWLELjjjjjLt# .         ,,        E Ktitiiiiiiiiiiii     ,jLjLL       jLLj#   GLLLLLLGKGEEEEKW
GELKGGLWGELjjjjjLt#j    GtKi      .G.      iitiiiiiiiiiiii             W    jjLj#   LjLLLLLLLL#EEEWK
GGLELGLKGEjjjjjjLtW.   t EEGEEEitKi        iiiiiiiiiiiiiit    jKt.KKEKWK.L, jjjj#   LLLGWKGGEG#EEEWK
GGLGLLLGLEjjjjjjLiK  j  .EGGGGGGEi  j      Kii,iiiiiii,iii  ,.  LGGGEEKKW# Etjjj#    LLLGGLGLLWWWWWW
EEKLLLGLGKjjjjjjjtE   WGKGEGEEEEEGE         iiEiiiiiiiijiiE   LEWi WEKKKKWWWjjjj#   .,jLLLLGjWGKKKWW
GGELWLELEEjjjjjjtti,.WKKG.tEGEEEWE.LL       Wi,iiiiiiiitiiE  K E    jEKKKWW#GLjL#   iLLLLGLGKLLKKKKK
GGGWGWGLWEtjjjjjtiE K#W    ttEKEWWW W        i,iiiiiiii,iij . .EEL  EjKEGWW.ELLL#   ELLjL##KLLLWEWKK
GGEEKjKWLEjjjjjLtiLK#L,     GLGLLWK          LiEiiiiiiiiiii   KE LiGGKEGEWW,GLLL#    jjji  #LLLWGKKG
GGGG#  jLEttjjjLtjW#..GEit LLjj.tjW          t,iiiiiiiiijii   WGitLj.L.ijKW,KjLL#   .LjL  .iGLLWLWWL
GGGEW   jGjjjjjLtEK   KG,t j  t . E           iiiiiiiiiiiii,  WGiijj t,.tLK KtjL##  ij   tL,LLLELKKj
GGGE# G  KjjjjjLt#L.. EG.i t  t , L           W,j,iiiiiii,iK  WL,ittit,.iLK Wttj#   t,   ,,jLLLGLKKj
GGGG#..# ijjjjjGi#t.  KG.i.t,.  , j           .,,,,iiiiii,iG  EL ,....   jK Wttj#   j   .,,#LLLLjWKj
GGGGW.t, ijjjjjGt#.   iEtii  .   ,t            #,iiiiiiiiti,  iL,..   .. jE Wttj#      Ki,.WLLGLLKKj
GGGGE.G,LijjjjjGtG     Et...     .j            .iLiiiiiiiii,   Li ..... .j  Kttj#     E,,, GLLGLLKWj
GGGGG..,,#jjjjjGtt     Gtt  ..    L             i.iiiiiiiii,E  L,,.    ..E  Wttj#     ,,., GLLELLWWj
GGGGGi,,,WtjjttGt.      j,.    ,j,              .tLiiiiiiiiiL         ,,i   Kttj#    j,.. WLLLELLKWj
GGGGG#.,,EtjjttLt        ..                     .t,i,iiiiiii,              .Kitt#    L... GLLLGLLKKj
GGGGGW. .Kttjttjj.                                .iiiiiiii,,              .KittW    L,..jGLLLGLLWEj
GGGGGWK.LKtjjtttG.                               ,LGi,iiii,,i              .KittK t  t,. GGLLLGLLWLj
LGGGGKEK #tjjtttK.                             .  .,,,iiiiii,t             .WittE j  ,..EGLLLjLLLWLj
jLGGGKEEL#tjjttt#.                             t  ,.j,iiiiiiiK             .Wittj   Wi. EGjjjLLLLWLj
jLLGGKEEEKtjjttt#..                            j   .K,iiiiiiit             .Witti   ,. KGGLjjjLLLWjj
jjjLGKEEEEtjjtti#,.                                ...iiiiiii,             .Witt E j .KLGLjjjjLjLWjj
jjjLGKEEELttjttt#,,                                 .Wiiiiiii,             .Witt KG  WGGGjjjjjjjjWjj
jjjjGKEEEjttjtti#,,                                   i,iiiiiit            .Kitt    #GGGGjjjjLjjjWtj
jjjjGKEEEtttjtti#i,                                  .LiiiiiiiW            .Eitt   KEEGELjjjjGjjLWjj
jjjjLKEEEtttjtti#W.                                  . iiiiiiii            .GitjELKEGGEGjjjjjELjjWtj
jjjjjEEGGtttttttWE..                                   tiiiiii,.           .LttGEEWGGGGLjjjLjEjjjWtt
jjjjjKELGttjtttiKEW,                                  . ,iiiii,K           .tttWGGWGGEGjjjjLjELjjWtj
jjjjjEELEttjttttEEK.                                   .Kiiiiii,            iitWGGEGGEjjjjjLLGjjjKtt
jjjjjEELKttjtttiEEEi.                                  . iiiiiii           .iit#EEGGGEjjjjjLjGjjjKtt
jjjjjGEL#ttLttt,EEEW.                                    iiiiiiiL         ..ittWGKEGGLjjjjjjLGjjjKtt
jjjjtEEjWttGttiiEEEWt.                                  .i,iiii,i         ..ittKGWGGGjjjjjLjGLjjjWtt
jjjjtEELKttKttttKEEWE                       Ki      Li    ,iiiiii         ,.ittGGEGEEjjjjjjjKLjjtKtt
jjjjtEGLLttEtttjEEEKKW.                   .,          G   Eiiiiiij        ,KittEGGGGtjjjjjjjGLjjtKtt
jjjjtEGjtttGttiGKEEKEEE                                    iiiiiii       .WGitiEGGGGtjjtjjjjLLjjtKtt
jjjjLELjtttjttiKEEEEEEKt                                   Liiiiii      ,WjKitjGEGGLtjtLjGjtLLjjtKit
jjjjGELjttjttti#KEEEEEEK,.                                 ,iiiiiiK    ,WLLWitGEWGEttjtjjjjtLGjjtKtt
jjjjKEjjttjttti#KEEEEEKEKt                                 .iiiiiii   ,LjLL#itKGEGEjtjjtjjjjLGjjtKjt
jjjjWELLttttttiWKEEEEEKKKEW,                                jiiiiiiE .WGLLLKit#GGGttttLttjjGLEjttWEt
jjjj#EjKttttttiWKEEKEEKKEKK#,                                ,iiiii, KEjLLLLitWGGEtttttjtjjKLEjttKWt
jjjjWGjWttttttiKEEEKEEKKEKW#KG.                            . #iiiiiiKGGjLLLtitKGELttttttjjjELEjttKWt
tjtjKLLWttttttiKKEEWEEKKKEWWEKWt                              iiiiii,ELLLLL,itEEGtttttttLjtGLKjttKWt
jLjjEjjEttttttiKKEEWEEKKKKW#EEEEE.                            tiiiiiiLLLLLK,itEEGtttjjttGjtLLKttiKKi
jLjjGjLjttLttt,KEKKKEKKKKKWWEKEEKKE.                         ,GiiiiiiLLLLLW,ttGKWttttLttGtjLjEjtiKKi
jtjjEjjtttGtttiKKKKKEEKKKKWKEEEEEEEKi,                     i WG,iiiii,LLLLWitiGKtttttjttLttjtGttiKKG
jtttKjjittEtttiKKKWEEEKKKKKEEEEEEEKKKLi,                 ,.WGGGWiiiii,KjLWWitiGKttttttttLttjtjttiKWW
jtttKjttttEtttLKKEWKKKKKKKKKKEEEEEEEEj.W,              .,K.WEGLGiii,i,ijjKWittGWttttttttLttttjtttKKK
GtttLjtjttLtttEKKKKKKKKKKKWKEEEEEEEKWG,,,GL,         ,iK.,,K#W#WiiiiiittWLWttLGWttttttttLttttjGttKKK
jttttjjtttjttiWKKKKKKKKKKEKKKW#######G,ii,,,KK,    iKiiii,,K####Gi,LiiiiELWttKGEttttttttLttttjKttKKK
tttLttGjtittti#KKWKKKKEKK##W#WWWWW##WG,,,,,,,,,ijj,,,,,,,,,W#####iijtiii,LKitWEGttttttttLttttjjttKKK
jttKttWtttittiWEKKKKKKW############GGj,,,,,,,,,,i,,,,,,,,,,W#####iiijtiiiWGitWEWttttttttLtttttjttWKK                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                               

                