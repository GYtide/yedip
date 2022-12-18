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
    return { 'rNumber': rNumber, 'rmax': rmax, 'gNumber': gNumber, 'gmax': gmax, 'bNumber': bNumber, 'bmax': bmax }

}

/** 
 * 直方图均衡化
 * @param imdata 原始像素数组 
 * 
*/
function HistogramEqualization(imdata) {
    // 计算直方图,使用时已经灰度化,使用任意 RGB 值作为灰度值


    var hist = histogramData(imdata).rNumber
    // 计算累积分布

    var cumuhist = [] //各灰度的累积分布
    cumuhist[0] = hist[0]
    for (let i = 1; i < 256; ++i) {
        cumuhist[i] = cumuhist[i - 1] + hist[i]
    }

    // 归一化
    
    for (let i = 0; i < 256; ++i) {
        cumuhist[i] = cumuhist[i] / (imdata.length / 4)
    }

    // 均衡化  imdata 的灰度值替换为 其累积分布 * 255

    for (let i = 0; i < imdata.length; i = i + 4) {
        imdata[i] = Math.round(cumuhist[imdata[i]] * 255)
    }
}


/**
 * 添加随机噪声 Gaussiannoise
 * @param imdata 原始像素数组
 */

function Gaussiannoise(imdata, type) {
    if (type == 'rgb') {
        for (let j = 0; j < imdata.length; j += 4) {

            noisepoint = Math.round(Math.random() * 60 - 30); //-30 - 60随机数
            if (imdata[j] + noisepoint > 255) {
                imdata[j] = 255
            } else if (imdata[j] + noisepoint < 0) {
                imdata[j] = 0
            }
            else {

                imdata[j] = imdata[j] + noisepoint;
            }
            if (imdata[j + 1] + noisepoint > 255) {
                imdata[j + 1] = 255
            } else if (imdata[j + 1] + noisepoint < 0) {
                imdata[j + 1] = 0
            }
            else {

                imdata[j + 1] = imdata[j + 1] + noisepoint;
            }
            if (imdata[j + 2] + noisepoint > 255) {
                imdata[j + 2] = 255
            } else if (imdata[j + 2] + noisepoint < 0) {
                imdata[j + 2] = 0
            }
            else {

                imdata[j + 2] = imdata[j + 2] + noisepoint;
            }
        }
    }
    else {
        for (let j = 0; j < imdata.length; j += 4) {

            noisepoint = Math.round(Math.random() * 60 - 30); //-30 - 60随机数
            if (imdata[j] + noisepoint > 255) {
                imdata[j] = imdata[j + 1] = imdata[j + 2] = 255
            } else {

                imdata[j] = imdata[j + 1] = imdata[j + 2] = imdata[j] + noisepoint;
            }
        }
    }


    return true;

}


/**
 * 添加椒盐噪声 Pretzelnoise
 * @param imdata 原始像素数组
 */

function Pretzelnoise(imdata, type) {
    if (type == 'rgb') {
        for (let j = 0; j < imdata.length; j += 4) {

            noisepoint = Math.random(); //0-1随机数
            if (noisepoint > 0.99) {
                imdata[j] = 0
            }
            else if (noisepoint < 0.01) {

                imdata[j] = 255
            }
            noisepoint = Math.random(); //0-1随机数
            if (noisepoint > 0.99) {
                imdata[j + 1] = 0
            }
            else if (noisepoint < 0.01) {

                imdata[j + 1] = 255
            }
            noisepoint = Math.random(); //0-1随机数
            if (noisepoint > 0.99) {
                imdata[j + 2] = 0
            }
            else if (noisepoint < 0.01) {

                imdata[j + 2] = 255
            }
        }
    }
    else {
        for (let j = 0; j < imdata.length; j += 4) {

            noisepoint = Math.random(); //0-1随机数
            if (noisepoint > 0.99) {
                imdata[j] = imdata[j + 1] = imdata[j + 2] = 0
            }
            else if (noisepoint < 0.01) {

                imdata[j] = imdata[j + 1] = imdata[j + 2] = 255
            }
        }
    }


    return true;
}

/**
 * 均值滤波
 * @param imdata 原始像素数组
 * @param width 图像宽度
 * @param height 图像高度
 */
function Meanvaluefilter(imdata, width, height) {
    for (let j = 1; j < height-1; ++j) {
        for (let i = 1; i < width-1; ++i) {
            averg = 0;
            //求周围近邻均值，我采用的是邻近。可以采用邻近也就是包含其本身点
            averg = Math.round(imdata[(j - 1) * width + (i - 1)] + imdata[(j - 1) * width + i]
                + imdata[(j - 1) * width + (i + 1)] + imdata[j * width + (i - 1)]
                + imdata[j * width + i + 1] + imdata[(j + 1) * width + (i - 1)]
                + imdata[(j + 1) * width + i] + imdata[(j + 1) * width + i + 1]) / 8;
            imdata[j * width + i] = averg;
        }
    }
    return true;

}

/**
 * 中值滤波
 * @param imdata 原始像素数组
 * @param width 图像宽度
 * @param height 图像高度
 */
function Medianvaluefilter(imdata, width, height) {

    // 排序

    function sort(arr) {
        for (var j = 0; j < arr.length - 1; j++) {
            for (var i = 0; i < arr.length - 1; i++) {
                // 如果前一个数 大于 后一个数 就交换两数位置
                if (arr[i] > arr[i + 1]) {
                    var temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                }
            }
        }
    }

    for (let j = 1; j < height-1; ++j) {
        for (let i = 1; i < width-1; ++i) {
            averg = 0;
            //求周围近邻均值，我采用的是邻近。可以采用邻近也就是包含其本身点

            arr = [imdata[(j - 1) * width + (i - 1)], imdata[(j - 1) * width + i],
            imdata[(j - 1) * width + (i + 1)], imdata[j * width + (i - 1)]
                , imdata[j * width + i], imdata[j * width + i + 1], imdata[(j + 1) * width + (i - 1)]
                , imdata[(j + 1) * width + i], imdata[(j + 1) * width + i + 1]]
            sort(arr)
            medv = arr[4]
            imdata[j * width + i] = medv;
        }
    }
    return true;
}

/**
 * 水平一阶锐化后生成水平浮雕
 * @param imdata 原始像素数组
 * @param width 图像宽度
 * @param height 图像高度
 * 
 * 使用以下横向模板 
 * 
 *     1  2  1
 *     0  0  0
 *    -1 -2 -1
 * 
 * 之后加一正整数,生成类似浮雕效果
 */

function Horizontalsharpe(imdata, width, height) {
    
    var tmpimdata = []
    // 复刻一个数组
    for(let i = 0 ; i < imdata.length ;++i){
        tmpimdata[i] = imdata[i]
    }


    // 排序函数
    function sort(arr) {
        for (var j = 0; j < arr.length - 1; j++) {
            for (var i = 0; i < arr.length - 1; i++) {
                // 如果前一个数 大于 后一个数 就交换两数位置
                if (arr[i] > arr[i + 1]) {
                    var temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                }
            }
        }
    }

    for (let j = 1; j < height-1; ++j) {
        for (let i = 1; i < width-1; ++i) {
            averg = 0;
            // 进行锐化
            newdata = tmpimdata[(j - 1) * width + (i - 1)]*1 + tmpimdata[(j - 1) * width + i]*2 +
            tmpimdata[(j - 1) * width + (i + 1)]*1 + tmpimdata[j * width + (i - 1)]*0
                + tmpimdata[j * width + i]*0 + tmpimdata[j * width + i + 1]*0 + tmpimdata[(j + 1) * width + (i - 1)]*(-1)
                + tmpimdata[(j + 1) * width + i]*(-2) + tmpimdata[(j + 1) * width + i + 1]*(-1)
            
            imdata[j * width + i] = newdata;

            // console.log(newdata)s
        }
    }

    // 锐化后处理，添加范围内最小数的绝对值

    for (let j = 1; j < height; j+=3) {
        for (let i = 1; i < width; i+=3) {
            averg = 0;
            // 进行锐化
            arr = [imdata[(j - 1) * width + (i - 1)], imdata[(j - 1) * width + i],
            imdata[(j - 1) * width + (i + 1)], imdata[j * width + (i - 1)]
                , imdata[j * width + i], imdata[j * width + i + 1], imdata[(j + 1) * width + (i - 1)]
                , imdata[(j + 1) * width + i], imdata[(j + 1) * width + i + 1]]
            sort(arr)
            let mix

            if(arr[0]<0){

                mix = arr[0]
                console.log(mix)
                imdata[(j - 1) * width + (i - 1)]-=2*mix
                imdata[(j - 1) * width + i]-=2*mix
                imdata[(j - 1) * width + (i + 1)]-=2*mix 
                imdata[j * width + (i - 1)]-=2*mix
                imdata[j * width + i]-=2*mix 
                imdata[j * width + i + 1]-=2*mix 
                imdata[(j + 1) * width + (i - 1)]-=2*mix
                imdata[(j + 1) * width + i]-=2*mix 
                imdata[(j + 1) * width + i + 1]-=2*mix

            }

        }
    }


    return true;
}
