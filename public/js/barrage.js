document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.danmu-container');
    const input = document.getElementById('danmuInput');
    const button = document.getElementById('sendDanmu');

    // 音频文件路径
    const audioPaths = [
        '../public/audio/bbkb.mp3',
        '../public/audio/omg.mp3',
        '../public/audio/ss.mp3'
    ];

    function playRandomAudio() {
        const randomAudio = audioPaths[Math.floor(Math.random() * audioPaths.length)];
        const audio = new Audio(randomAudio);
        audio.play();
    }

    function createDanmu(text) {
        const danmu = document.createElement('div');
        danmu.classList.add('danmu');
        danmu.textContent = text;

        // 随机颜色
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        danmu.style.color = randomColor;

        // 随机垂直位置
        danmu.style.top = `${Math.random() * 100}%`;

        container.appendChild(danmu);

        // Remove the danmu after it goes off-screen
        danmu.addEventListener('animationend', function() {
            container.removeChild(danmu);
        });
    }

    function generateDanmu() {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        createDanmu(randomMessage);
    }

    button.addEventListener('click', function() {
        const userInput = input.value.trim();

        if (userInput) {
            createDanmu(userInput);
            input.value = '';
            playRandomAudio(); // 点击发送时播放随机音频
        }
    });

    // 新增：监听回车键发送弹幕
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { // 检测是否按下 Enter 键
            const userInput = input.value.trim();

            if (userInput) {
                createDanmu(userInput);
                input.value = '';
                playRandomAudio(); // 回车时播放随机音频
            }
        }
    });

    setInterval(generateDanmu, 1000);
});
