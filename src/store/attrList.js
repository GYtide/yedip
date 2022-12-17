/*
* 对 canvas 进行对应调整
*/

/**
 * 灰度化
 * @param method 灰度化方式
 */
function rgb2gray(method) {

    if (graphNow) {
        let cans = graphNow.getImage().getContext('2d')

        let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

        let imdata = catx.data

        graphNow.type = 'gray'

        if (method == 'mean') {
            for (let i = 0; i < imdata.length; i += 4) {
                imdata[i] = graphNow.meangrayImage[i]
                imdata[i + 1] = graphNow.meangrayImage[i + 1]
                imdata[i + 2] = graphNow.meangrayImage[i + 2]
            }
        }
        else {
            // imdata = grayImage
            for (let i = 0; i < imdata.length; i += 4) {
                imdata[i] = graphNow.grayImage[i]
                imdata[i + 1] = graphNow.grayImage[i + 1]
                imdata[i + 2] = graphNow.grayImage[i + 2]
            }
        }
        cans.putImageData(catx, 0, 0)
        let hisdata = histogramData(imdata)
        // 清除现有直方图
        clearHistogram()
        // 画出灰度直方图
        drawHistogram("graychart", hisdata.bNumber, "灰度直方图", ['#111111'], hisdata.bmax);
    }
    layer.draw();
    // todo  graphNow 为空时弹出提示框

}

/**
 * 还原为原图
 */
function return2src() {
    if (graphNow) {
        // 还原图像,将图像的 srcImage 输出到 canvas 画布上

        // console.log(graphNow.srcImage)

        graphNow.type = 'rgb'
        let srcImage = graphNow.srcImage

        let cans = graphNow.getImage().getContext('2d')

        let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

        let imdata = catx.data
        for (let i = 0; i < imdata.length; i += 4) {
            imdata[i] = srcImage[i]
            imdata[i + 1] = srcImage[i + 1]
            imdata[i + 2] = srcImage[i + 2]
        }

        // 画出直方图
        clearHistogram()
        let hisdata = histogramData(imdata)
        drawHistogram("rchart", hisdata.rNumber, "直方图R", ['#ff0000'], hisdata.rmax);
        drawHistogram("gchart", hisdata.gNumber, "直方图G", ['#00ff00'], hisdata.gmax);
        drawHistogram("bchart", hisdata.bNumber, "直方图B", ['#0000ff'], hisdata.bmax);

        cans.putImageData(catx, 0, 0)
        layer.draw();

    }
}


/**
 * 清空现有直方图
 */
function clearHistogram() {
    var myChart = echarts.init(document.getElementById('rchart'));
    myChart.clear()
    myChart = echarts.init(document.getElementById('gchart'));
    myChart.clear()
    myChart = echarts.init(document.getElementById('bchart'));
    myChart.clear()
    myChart = echarts.init(document.getElementById('graychart'));
    myChart.clear()
}

/**
 * 画出直方图
 */
function drawHistogram(id, data, title, color, rangeNum) {
    rangeNum = 256
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(id));
    // console.log(myChart)
    let ranges = new Array(rangeNum).fill(0), displayData = new Array(rangeNum).fill(0);
    let delt = Math.ceil(256 / rangeNum);
    for (let i = 0; i < rangeNum; i++) {
        ranges[i] = i;
        for (let j = 0; j < delt; j++) {
            displayData[i] += data[i * delt + j];
        }
    }
    // console.log(ranges);
    myChart.setOption({
        title: {
            text: title,
        },
        tooltip: {},//悬浮显示
        xAxis: {
            data: ranges
        },
        yAxis: {
            type: "value",//y轴显示区间分量的个数
        },
        series: [{
            name: '个数',
            type: 'bar',
            color: color,
            data: displayData
        }]
    }, rangeNum);
}

/**
 * 均衡化直方图
 * 
 */

function Equalization() {
    if (graphNow) {
        if (graphNow.type == 'gray') {
            let cans = graphNow.getImage().getContext('2d')

            let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

            let imdata = catx.data

            HistogramEqualization(imdata)

            // 画出直方图
            clearHistogram()
            let hisdata = histogramData(imdata)
            // 画出灰度直方图
            console.log(hisdata.rNumber)
            drawHistogram("graychart", hisdata.rNumber, "灰度直方图", ['#111111'], hisdata.rmax);

            cans.putImageData(catx, 0, 0)
            layer.draw();
        }
        else{
            // 不是灰度图先进行灰度化
            rgb2gray()
            let cans = graphNow.getImage().getContext('2d')

            let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

            let imdata = catx.data
            HistogramEqualization(imdata)
            // 画出直方图
            clearHistogram()
            let hisdata = histogramData(imdata)
            // 画出灰度直方图
            drawHistogram("graychart", hisdata.rNumber, "灰度直方图", ['#111111'], hisdata.rmax);

            cans.putImageData(catx, 0, 0)
            layer.draw();
        }

    }
}
