/*
* 本模块定义图像处理算法
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
    // 添加平均值灰度
    for (let i = 0; i < imdata.length; i += 4) {
        const [r, g, b] = [
            imdata[i],
            imdata[i + 1],
            imdata[i + 2]
        ]
        const lm = (r + g + b) / 3
        grayImage[i] = lm
        grayImage[i + 1] = lm
        grayImage[i + 2] = lm
    }

    return grayImage

}


/**
 * 生成直方图数据
 * @param imdata 原始像素数组
 */

function histogramData(imdata) {    
    // 统计每一个像素点的RGB三通道
    rNumber = new Array(256).fill(0);
    gNumber = new Array(256).fill(0);
    bNumber = new Array(256).fill(0);

    var rmax = 0
    var gmax = 0
    var bmax = 0

    for (let i = 0; i < imdata.length; i += 4) {
        rNumber[imdata[i]]++;
        gNumber[imdata[i + 1]]++;
        bNumber[imdata[i + 2]]++;
        // console.log(imdata[i], imdata[i + 1], imdata[i + 2])
        if (rmax < imdata[i]) {
            rmax = imdata[i]
        }

        if (gmax < imdata[i + 1]) {
            gmax = imdata[i + 1]
        }

        if (bmax < imdata[i + 2]) {
            bmax = imdata[i + 2]
        }

    }
    return { 'rNumber': rNumber, 'rmax' :rmax,'gNumber': gNumber,'gmax' :gmax, 'bNumber': bNumber ,'bmax' :bmax}

}

/** 
 * 直方图均衡化
 * @param imdata 原始像素数组 
 * 
*/
function HistogramEqualization(imdata){
    // 计算直方图,使用时已经灰度化,使用任意 RGB 值作为灰度值


    var hist = histogramData(imdata).rNumber
    // 计算累积分布

    var cumuhist = [] //各灰度的累积分布
    cumuhist[0] = hist[0]
    for(let i = 1 ; i < 256 ; ++i){
        cumuhist[i] = cumuhist[i-1] + hist[i]
    }

    // 归一化

    for(let i = 0 ; i < 256 ; ++i){
        cumuhist[i] = cumuhist[i]/(imdata.length/4)
    }

    // 均衡化  imdata 的灰度值替换为 其累积分布 * 255

    for(let i = 0; i < imdata.length ; i = i+4){
        imdata[i] = Math.round(cumuhist[imdata[i]]*255)
    }
}
