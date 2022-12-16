/*
* 本模块定于图像处理算法
*/


/**
* 加权平均灰度化
* @param imdata 原始像素数组
*/
function weightGray(imdata) {
    var grayImage = []
    // 添加加权灰度
    for (let i = 0; i < imdata.length; i += 4) {
        const [r, g, b] = [
            imdata[i],
            imdata[i + 1],
            imdata[i + 2]
        ]
        const lm = 0.299 * r + 0.587 * g + 0.114 * b
        grayImage[i] = lm
        grayImage[i + 1] = lm
        grayImage[i + 2] = lm
    }

    return grayImage

}


/**
* 平均灰度化
* @param imdata 原始像素数组
*/
function meanGray(imdata) {
    var grayImage = []
    // 添加加权灰度
    for (let i = 0; i < imdata.length; i += 4) {
        const [r, g, b] = [
            imdata[i],
            imdata[i + 1],
            imdata[i + 2]
        ]
        const lm = (r +  g +  b)/3
        grayImage[i] = lm
        grayImage[i + 1] = lm
        grayImage[i + 2] = lm
    }

    return grayImage

}