// 音乐播放器
class MusicPlayer {
    constructor(
        data = {
            // 歌曲信息在这里修改
            songObjArr: [
                {
                    title: "Bad Boy",  // 歌曲名
                    author: "Red Velvet",   // 歌手
                    imgSrc: "../public/img/BadBoy.jpg", // 图片路径
                    url: "../public/audio/Red Velvet - Bad Boy.mp3", // 音频路径
                },
                {
                    title: "影色舞",
                    author: "MyGO!!!!!",
                    imgSrc: "../public/img/yingshanwu.jpg",
                    url: "../public/audio/MyGO!!!!! - 影色舞.mp3",
                },
                {
                    title: "ECHO",
                    author: "Crusher-P GUMI",
                    imgSrc: "../public/img/ECHO.jpg",
                    url: "../public/audio/Crusher-P GUMI - ECHO.mp3",
                },
            ],
            currentIndex: 0,
        }
    ) {
        // 与 _renderFrame 相关变量
        this._startTime = null;
        this._isRunTimeArr = new Array(2).fill(false);
        this._requestID = null;

        this._songObjArr = data.songObjArr;
        this.__currentIndex = data.currentIndex;
        // 用户是否进行了播放操作
        this._isUserPlay = false;

        this._mImgBoxDom = document.querySelector(".music-box");

        // 播放器单体
        this._musicPlayerEntity = new Entity();

        // 音乐图片组件
        this._musicPlayerEntity.addComp(
            new MusicImgComp({
                imgSrcArr: Array.from(this._songObjArr, (item) => item.imgSrc),
                currentImgIndex: this._currentIndex,
            })
        );

        // 音乐控制组件
        this._musicPlayerEntity.addComp(
            new MusicControlComp({
                onClickMPreviousBtn: () => {
                    this._currentIndex = this._currentIndex - 1;
                },
                onClickMPlayBtn: () => {
                    if (this._startTime === null && this._musicPlayerEntity.getComp("musicComp").isCanPlay) {
                        this._musicPlayerEntity.getComp("musicComp").isPlay = !this._musicPlayerEntity.getComp("musicComp").isPlay;
                        this._isUserPlay = this._musicPlayerEntity.getComp("musicComp").isPlay;
                    }
                },
                onClickMNextBtn: () => {
                    this._currentIndex = this._currentIndex + 1;
                },
                onClickMProgressBar: (event) => {
                    if(!this._musicPlayerEntity.getComp("musicComp").isCanPlay) {
                        return;
                    }
                    if(event.target === this._musicPlayerEntity.getComp("musicControlComp").mProgressBtnDom){
                        return;
                    }
                    const time = this._getXTime(event.offsetX);
                    this._musicPlayerEntity.getComp("musicControlComp").currentTime = time;
                    this._musicPlayerEntity.getComp("musicComp").currentTime = time;
                },
                onMousedownMProgressBtn: (event) => {
                    if(!this._musicPlayerEntity.getComp("musicComp").isCanPlay) {
                        return;
                    }
                    this._musicPlayerEntity.getComp("musicControlComp").isSetProgressBar = true;
                    const x = event.clientX;
                    let time = this._musicPlayerEntity.getComp("musicComp").currentTime;
                    const px = this._getTimeX(time);
                    let currentX = 0;

                    // 鼠标移动事件回调
                    const onMImgBoxMousemove = (event) => {
                        const bx = event.clientX;
                        const betweenNum = bx - x;
                        currentX = px + betweenNum;
                        if(currentX < 0) {
                            currentX = 0;
                        } else if (currentX > this._musicPlayerEntity.getComp("musicControlComp").totalProgressW){
                            currentX = this._musicPlayerEntity.getComp("musicControlComp").totalProgressW;
                        }
                        time = this._getXTime(currentX);
                        this._musicPlayerEntity.getComp("musicControlComp").currentTime = time;
                    }
                    this._mImgBoxDom.addEventListener("mousemove", onMImgBoxMousemove);

                    // 操作完成回调
                    const removeCB = () => {
                        this._mImgBoxDom.removeEventListener("mousemove", onMImgBoxMousemove);
                        this._mImgBoxDom.removeEventListener("mouseup", removeCB);
                        this._mImgBoxDom.removeEventListener("mouseleave", removeCB);
                        this._musicPlayerEntity.getComp("musicComp").currentTime = time;
                        this._musicPlayerEntity.getComp("musicControlComp").isSetProgressBar = false;
                    }

                    this._mImgBoxDom.addEventListener("mouseup", removeCB);
                    this._mImgBoxDom.addEventListener("mouseleave", removeCB);
                }
            })
        );

        // 音乐描述组件
        this._musicPlayerEntity.addComp(
            new MusicDescComp({
                mDescArr: Array.from(this._songObjArr, item => {
                    return { title: item.title, author: item.author }
                }),
                currentDescIndex: this._currentIndex
            })
        )

        // 音乐组件
        this._musicPlayerEntity.addComp(
            new MusicComp({
                mUrlArr: Array.from(this._songObjArr, item => item.url),
                currentUrlIndex: this._currentIndex,
                onCanplay: () => {
                    this._musicPlayerEntity.getComp("musicComp").isCanPlay = true;
                    this._musicPlayerEntity.getComp("musicControlComp").totalTime = this._musicPlayerEntity.getComp("musicComp").totalTime;

                    if(this._isUserPlay) {
                        this._musicPlayerEntity.getComp("musicComp").isPlay = true;
                    }
                },
                onPlay: () => {
                    this._musicPlayerEntity.getComp("musicControlComp").isPlay = true;
                },
                onPause: () => {
                    this._musicPlayerEntity.getComp("musicControlComp").isPlay = false;
                },
                onEnded: () => {
                    this._currentIndex = this._currentIndex + 1;
                },
                onTimeupdate: () => {
                    if(this._musicPlayerEntity.getComp("musicControlComp").isSetProgressBar) {
                        return;
                    }
                    this._musicPlayerEntity.getComp("musicControlComp").currentTime = this._musicPlayerEntity.getComp("musicComp").currentTime;
                    this._musicPlayerEntity.getComp("musicControlComp").loadTime = this._musicPlayerEntity.getComp("musicComp").loadTime;
                }
            })
        )
    }

    set _currentIndex(value) {
        if (this._startTime === null) {
            this._musicPlayerEntity.getComp("musicComp").isPlay = false;
            this._musicPlayerEntity.getComp("musicComp").isCanPlay = false;
            this._musicPlayerEntity.getComp("musicImgComp").isAnim = true;
            this._musicPlayerEntity.getComp("musicImgComp").switchDir = value - this._currentIndex;
            this._musicPlayerEntity.getComp("musicDescComp").isAnim = true;
            this._musicPlayerEntity.getComp("musicDescComp").switchDir = value - this._currentIndex;
            this._requestID = requestAnimationFrame(this._renderFrame.bind(this));
            let v =
                value < 0
                    ? this._songObjArr.length - 1
                    : value >= this._songObjArr.length
                        ? 0
                        : value;
            this.__currentIndex = v;
        }
    }

    get _currentIndex() {
        return this.__currentIndex;
    }

    // 根据相对于进度条的 x 坐标求出时间
    _getXTime(value) {
        return Math.floor(value * this._musicPlayerEntity.getComp("musicComp").totalTime / this._musicPlayerEntity.getComp("musicControlComp").totalProgressW);
    }

    // 根据时间求出相对于进度条的 x 坐标
    _getTimeX(time) {
        return time * this._musicPlayerEntity.getComp("musicControlComp").totalProgressW / this._musicPlayerEntity.getComp("musicComp").totalTime;
    }

    _renderFrame(timestamp) {
        this._requestID = requestAnimationFrame(this._renderFrame.bind(this));

        if (this._startTime === null) {
            this._startTime = timestamp;
        }

        if (timestamp >= this._startTime + 1000) {
            // 图片动画结束
            this._musicPlayerEntity.getComp("musicImgComp").isAnim = false;
            this._musicPlayerEntity.getComp("musicImgComp").currentImgIndex = this._currentIndex;

            // 描述动画结束
            this._musicPlayerEntity.getComp("musicDescComp").isAnim = false;

            // 结束更新
            cancelAnimationFrame(this._requestID);
            this._isRunTimeArr = this._isRunTimeArr.fill(false);
            this._startTime = null;
            return;
        }

        if (timestamp >= this._startTime + 500 && !this._isRunTimeArr[1]) {
            this._isRunTimeArr[1] = true;
            this._musicPlayerEntity.getComp("musicDescComp").currentDescIndex = this._currentIndex;

            // 切换音乐
            this._musicPlayerEntity.getComp("musicComp").currentUrlIndex = this._currentIndex;
        }
    }
}

// 单体
class Entity {
    constructor() {
        this._compMap = new Map();
    }

    addComp(comp) {
        this._compMap.set(comp.name, comp);
    }

    getComp(compName) {
        return this._compMap.get(compName);
    }
}

// 音乐图片
class MusicImgComp {
    constructor(data) {
        this.name = "musicImgComp";
        this._imgSrcArr = data.imgSrcArr;
        this._currentImgIndex = data.currentImgIndex;
        this._mImgContentDom = document.querySelector(".m-img-content");

        // 新建图片节点
        this._mImgDomArr = Array.from(
            new Array(this._imgSrcArr.length + 2),
            (item, index) => {
                const dom = document.createElement("img");
                switch (index) {
                    case 0:
                        dom.src = this._imgSrcArr[this._imgSrcArr.length - 1];
                        break;
                    case this._imgSrcArr.length + 1:
                        dom.src = this._imgSrcArr[0];
                        break;
                    default:
                        dom.src = this._imgSrcArr[index - 1];
                        break;
                }
                return dom;
            }
        );
        this._mImgContentDom.append(...this._mImgDomArr);

        this._switchDir = 1;
        this._isAnim = false;
        this.currentImgIndex = this._currentImgIndex;
    }

    set switchDir(value) {
        this._mImgContentDom.style.transform = `translateY(${-100 * (this._currentImgIndex + value + 1)
            }%)`;
        this._switchDir = value;
    }

    set currentImgIndex(value) {
        this._mImgContentDom.style.transform = `translateY(${-100 * (value + 1)}%)`;
        this._currentImgIndex = value;
    }

    set isAnim(value) {
        if (value) {
            this._mImgDomArr.forEach((item) => {
                item.classList.add("anim");
            });
            this._mImgContentDom.classList.add("tran");
        } else {
            this._mImgDomArr.forEach((item) => {
                item.classList.remove("anim");
            });
            this._mImgContentDom.classList.remove("tran");
        }
        this._isAnim = value;
    }
}

// 音乐控制
class MusicControlComp {
    constructor(data) {
        this.name = "musicControlComp";
        this._mPreviousBtnDom = document.querySelector(".m-previous-btn");
        this._mPlayBtnDom = document.querySelector(".m-play-btn");
        this._mNextBtnDom = document.querySelector(".m-next-btn");
        this._mPlayBtnSvgDom = document.querySelector(".m-play-btn svg");
        this._mProgressBarDom = document.querySelector(".m-progress-bar");
        this._mTotalTimeDom = document.querySelector(".m-total-time");
        this._mCurrentTimeDom = document.querySelector(".m-current-time");
        this._mProgressMainDom = document.querySelector(".m-progress-main");
        this.mProgressBtnDom = document.querySelector(".m-progress-btn");
        this._mProgressLoadDom = document.querySelector(".m-progress-load");

        this._isPlay = false;
        this._totalTime = 0;
        // 是否在设置进度条
        this.isSetProgressBar = false;
        this.totalProgressW = this._mProgressBarDom.clientWidth;

        this._mPreviousBtnDom.addEventListener("click", data.onClickMPreviousBtn);
        this._mPlayBtnDom.addEventListener("click", data.onClickMPlayBtn);
        this._mNextBtnDom.addEventListener("click", data.onClickMNextBtn);
        // 音乐进度条点击事件
        this._mProgressBarDom.addEventListener("click", data.onClickMProgressBar);
        this.mProgressBtnDom.addEventListener("mousedown", data.onMousedownMProgressBtn);

        this.currentTime = 0;
        this.loadTime = 0;
    }

    set isPlay(value) {
        if(value) {
            this._mPlayBtnSvgDom.innerHTML = `<use href = "#icon-24gf-pause2"></use>`;
        } else {
            this._mPlayBtnSvgDom.innerHTML = `<use href = "#icon-bofang"></use>`;
        }
        this._isPlay = value;
    }

    get isPlay() {
        return this._isPlay;
    }

    set totalTime(value) {
        this._mTotalTimeDom.textContent = this._getTimeDateStr(value);
        this._totalTime = value;
    }

    set currentTime(value) {
        if (this._totalTime === 0) {
            this._mProgressMainDom.style.width = "0%";
        }
        this._mProgressMainDom.style.width = `${value * 100 / this._totalTime}%`;
        this._mCurrentTimeDom.textContent = this._getTimeDateStr(value);
    }

    set loadTime(value) {
        if (this._totalTime === 0) {
            this._mProgressLoadDom.style.width = "0%";
        }
        this._mProgressLoadDom.style.width = `${value * 100 / this._totalTime}%`;
    }

    // 返回时间格式的字符串
    _getTimeDateStr(time) {
        if(!time) {
            return "00 : 00";
        }
        const minute = parseInt(time / 60);
        const second = time % 60;
        return `${minute < 10 ? "0" + minute : "" + minute} : ${second < 10 ? "0" + second : "" + second}`;
    }
}

// 音乐描述
class MusicDescComp {
    constructor(data) {
        this.name = "musicDescComp";
        this._mDescArr = data.mDescArr;
        this._currentDescIndex = data.currentDescIndex;
        this._mDescArticleDom = document.querySelector(".m-description-content>article");
        this._mTitleDom = document.querySelector(".m-title");
        this._mAuthorDom = document.querySelector(".m-author");

        this._switchDir = 1;
        this._isAnim = false;
        this.currentDescIndex = this._currentDescIndex;
    }

    set switchDir(value) {
        this._mDescArticleDom.style.setProperty("--transform-translateY", `translateY(${value * -20}%)`);
        this._switchDir = value;
    }

    set currentDescIndex(value) {
        this._mTitleDom.textContent = this._mDescArr[value].title;
        this._mAuthorDom.textContent = this._mDescArr[value].author;
        this._currentDescIndex = value;
    }

    set isAnim(value) {
        if (value) {
            this._mDescArticleDom.classList.add("anim");
        } else {
            this._mDescArticleDom.classList.remove("anim");
        }
        this._isAnim = value;
    }
}

// 音乐
class MusicComp {
    constructor(data) {
        this.name = "musicComp";
        this._mUrlArr = data.mUrlArr;
        this._currentUrlIndex = data.currentUrlIndex;
        this._audioDom = document.createElement("audio");

        this._isPlay = false;
        this._isCanPlay = false;

        this._audioDom.addEventListener("canplay", data.onCanplay);
        this._audioDom.addEventListener("play", data.onPlay);
        this._audioDom.addEventListener("pause", data.onPause);
        this._audioDom.addEventListener("ended", data.onEnded);
        this._audioDom.addEventListener("timeupdate", data.onTimeupdate);

        this.currentUrlIndex = this._currentUrlIndex;
    }

    set currentUrlIndex(value) {
        this._audioDom.src = this._mUrlArr[value];
        this._currentUrlIndex = value;
    }

    set isPlay(value) {
        if (value) {
            this._audioDom.play();
        } else {
            this._audioDom.pause();
        }
        this._isPlay = value;
    }

    get isPlay() {
        return this._isPlay;
    }

    // 音乐总的时间
    get totalTime() {
        return Math.floor(this._audioDom.duration);
    }

    set currentTime(value) {
        this._audioDom.currentTime = value;
    }

    get currentTime() {
        return Math.floor(this._audioDom.currentTime);
    }

    get loadTime() {
        const timeRanges = this._audioDom.buffered;
        let time = 0;
        if (timeRanges.length === 0) {
            time = 0;
        } else {
            time = Math.floor(timeRanges.end(timeRanges.length - 1));
        }
        return time;
    }

    set isCanPlay(value) {
        this._isCanPlay = value;
    }

    get isCanPlay() {
        return this._isCanPlay;
    }
}


new MusicPlayer();
