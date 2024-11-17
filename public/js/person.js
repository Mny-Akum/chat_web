    // 处理文件选择事件
    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // 将背景图片更换为所选图片
                document.querySelector('.fixed-frame').style.backgroundImage = `url(${e.target.result})`;
            };
            reader.readAsDataURL(file);
        }
    }

    // 获取文件上传控件
    const fileInput = document.getElementById('cover-upload');
        
    // 监听文件选择事件
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            alert(`您选择了文件: ${file.name}`);
            // 你可以在这里添加上传图片的逻辑
        }
    });