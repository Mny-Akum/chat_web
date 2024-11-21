import { h } from "vue";

//返回一个从start到end的随机整数，包括start和end
function getRandomNum(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}
//处理文件
// compress 包含height和width
function uploadFile(event){
    return new Promise((resolve,reject)=>{
        let files = event.target.files
        if(files.length > 0){
            resolve(files);
        }else{
            reject();
        }
    })
}
 // 将 Blob 数据读取为 Base64 格式
function imageToBase64(blob){
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            resolve(e.target.result);
        };
        // readAsDataURL
        fileReader.readAsDataURL(blob);
        fileReader.onerror = () => {
            reject(new Error('文件流异常'));
        };
    });
}
export {
    getRandomNum,
    uploadFile,
    imageToBase64
}