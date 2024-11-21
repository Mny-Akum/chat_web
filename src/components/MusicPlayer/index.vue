<template>
  <div class="music-box">
    <!-- 上部分 -->
    <article>
      <div class="m-img-box">
        <div class="m-img-content">
          <img v-for="(song, index) in songs" 
               :key="index"
               :src="song.imgSrc"
               :class="{ anim: isSwitching && currentIndex === index }"
               :style="{ display: index === currentIndex ? 'block' : 'none' }" />
        </div>
      </div>
      <div class="m-description-content">
        <article :class="{ anim: isSwitching }">
          <p class="m-title">{{ currentSong.title }}</p>
          <p class="m-author">{{ currentSong.author }}</p>
        </article>
        <!-- 播放按钮 -->
        <div class="m-btn-box">
          <button @click="previous">
            <svg class="icon" aria-hidden="true" style="transform: scale(-1)">
              <use href="#icon-xiayishou"></use>
            </svg>
          </button>
          <button @click="togglePlay">
            <svg class="icon" aria-hidden="true">
              <use :href="isPlaying ? '#icon-24gf-pause2' : '#icon-bofang'"></use>
            </svg>
          </button>
          <button @click="next">
            <svg class="icon" aria-hidden="true">
              <use href="#icon-xiayishou"></use>
            </svg>
          </button>
        </div>

      </div>
    </article>
    <!-- 下部分 -->
    <section>
      <span class="m-current-time">{{ formatTime(currentTime) }}</span>
      <div class="m-progress-bar" @click="seek">
        <div class="m-progress-main" :style="{ width: progressWidth + '%' }">
          <span class="m-progress-btn"></span>
        </div>
        <div class="m-progress-load" :style="{ width: bufferWidth + '%' }"></div>
      </div>
      <span class="m-total-time">{{ formatTime(totalTime) }}</span>
    </section>


  </div>
</template>

<script>
import "./js/iconfont"
export default {
  name: "MusicPlayer",
  data() {
    return {
      songs: [
        {
          title: "Bad Boy",
          author: "Red Velvet",
          imgSrc: "/img/BadBoy.jpg",
          url: "/audio/Red Velvet - Bad Boy.mp3",
        },
        {
          title: "影色舞",
          author: "MyGO!!!!!",
          imgSrc: "/img/yingshanwu.jpg",
          url: "/audio/MyGO!!!!! - 影色舞.mp3",
        },
        {
          title: "ECHO",
          author: "Crusher-P GUMI",
          imgSrc: "/img/ECHO.jpg",
          url: "/audio/Crusher-P GUMI - ECHO.mp3",
        },
      ],
      currentIndex: 0,
      isPlaying: false,
      currentTime: 0,
      totalTime: 0,
      bufferWidth: 0,
      audio: null,
      isSwitching: false,
    };
  },
  computed: {
    currentSong() {
      return this.songs[this.currentIndex];
    },
    progressWidth() {
      return this.totalTime ? (this.currentTime / this.totalTime) * 100 : 0;
    },
  },
  methods: {
    initAudio() {
      this.audio = new Audio(this.currentSong.url);
      this.audio.addEventListener("timeupdate", this.updateProgress);
      this.audio.addEventListener("canplay", () => {
        this.totalTime = Math.floor(this.audio.duration);
      });
      this.audio.addEventListener("ended", this.next);
    },
    playAudio() {
      this.audio.play();
      this.isPlaying = true;
    },
    pauseAudio() {
      this.audio.pause();
      this.isPlaying = false;
    },
    togglePlay() {
      if (!this.audio) {
        this.initAudio();
      }
      this.isPlaying ? this.pauseAudio() : this.playAudio();
    },
    previous() {
      this.switchSong(-1);
    },
    next() {
      this.switchSong(1);
    },
    switchSong(direction) {
      this.isSwitching = true;
      setTimeout(() => (this.isSwitching = false), 1000);
      this.currentIndex =
        (this.currentIndex + direction + this.songs.length) % this.songs.length;
      this.audio.src = this.currentSong.url;
      if (this.isPlaying) this.audio.play();
    },
    updateProgress() {
      this.currentTime = Math.floor(this.audio.currentTime);
      if (this.audio.buffered.length) {
        const bufferEnd = this.audio.buffered.end(this.audio.buffered.length - 1);
        this.bufferWidth = (bufferEnd / this.totalTime) * 100;
      }
    },
    seek(event) {
      const progressBar = event.currentTarget;
      const clickPosition = event.offsetX / progressBar.offsetWidth;
      const seekTime = clickPosition * this.totalTime;
      this.audio.currentTime = seekTime;
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes < 10 ? "0" : ""}${minutes} : ${
        secs < 10 ? "0" : ""
      }${secs}`;
    },
  },
  mounted() {
    this.initAudio();
  },
};
</script>

<style scoped lang="scss">
*{
    margin: 0;
    padding: 0;
}
html  {
    /* font-size: 0.0625px; */
    color: var(--color-font);
}

.music-box {
    flex: none;
    width: 36rem;
    height: 18rem;
    border-radius: 2rem;
    /* box-sizing: border-box; */
    /* background-color: rgb(232, 232, 232, 0.7); */
    backdrop-filter: blur(1rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 2.5rem;
    box-shadow: inset 0px 0px 1rem 0.2rem rgb(255, 255, 255, 0.5);
    user-select: none;
}

/* music-box 上部分 */
.music-box>article {
    width: 100%;
    display: flex;
    justify-content: flex-start;
}

/* 图片部分 */
.m-img-box {
    flex: none;
    width: 8.3rem;
    height: 8.3rem;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0px 0px 1rem 0px rgba(255, 255, 255, 0.25),
        0px 0px 0.8rem 0px inset rgba(0, 0, 0, 0.05);
}

.m-img-content {
    width: 100%;
    height: 100%;
}

.m-img-content.tran {
    transition: transform 0.4s linear 0.3s;
}

.m-img-content>img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.8rem;
    transform: scale(1);
}

.m-img-content>img.anim {
    animation: img-anim 1s linear forwards;
}

@keyframes img-anim {
    30% {
        transform: scale(0.6);
    }

    70% {
        transform: scale(0.6);
    }

    100% {
        transform: scale(1);
    }
}

/* 描述部分 */
.m-description-content {
    position: relative;
    margin-left: 2rem;
    width: 0;
    flex: 1;
}

.m-description-content>article {
    opacity: 1;
}

.m-description-content>article.anim {
    animation: desc-cont-anim 1s ease-in forwards;
}

@keyframes desc-cont-anim {
    30% {
        opacity: 0;
        transform: var(--transform-translateY);
    }

    70% {
        opacity: 0;
        transform: translateY(0);
    }

    100% {
        opacity: 1;
    }
}

.m-title {
    font-size: 1.6rem;
    font-weight: 500;
    height: 2.5rem;
    line-height: 2.5rem;
}

.m-author {
    font-size: 1.25rem;
    font-weight: 400;
    color: #2f2f2f;
}

.m-title,
.m-author {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.m-btn-box {
    position: absolute;
    bottom: 0;
    width: 15rem;
    display: flex;
    justify-content: space-between;
}

.m-btn-box>button {
    background: none;
    border: none;
    outline: none;
    width: 3rem;
    height: 1.7rem;
}

.icon {
    width: 100%;
    height: 100%;
    vertical-align: middle;
    fill: var(--color-font);
    overflow: hidden;
}

.m-btn-box>button:active>.icon {
    width: 1.67rem;
    height: 1.67rem;
}

/* music-box 下部分 */
.music-box>section {
    width: 100%;
    font-size: 1.3rem;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.4rem;
    box-sizing: border-box;
}

.m-progress-bar {
    width: 17rem;
    height: 0.5rem;
    background-color: #6b6b6b;
    border-radius: 3px;
    overflow: hidden;
}

.m-progress-main {
    float: left;
    height: 100%;
    width: 20%;
    background-color: #ffffff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.m-progress-btn {
    position: absolute;
    transform: translateX(50%);
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: #ffffff;
    transition: width 0.1s linear, height 0.1s linear;
}

.m-progress-btn:active {
    width: 1.15rem;
    height: 1.15rem;
}

.m-progress-load {
    height: 100%;
    width: 50%;
    background-color: #a0a0a0;
}

</style>