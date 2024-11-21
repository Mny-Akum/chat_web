//返回一个从start到end的随机整数，包括start和end
function getRandomNum(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}
export {
    getRandomNum
}