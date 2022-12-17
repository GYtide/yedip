function drawImage(imageObj) {

    let srcstring = imageObj.src
    // 去除 路径前的 file:/// 否则 ndoe 无法读取
    srcstring = srcstring.slice(8,)
    // console.log(typeof srcstring);
    // 添加文件属性
    try {
        //读取文件
        var rbuf = fs.readFileSync(srcstring);
    } catch (err) {
        console.log(err);
        alert("文件读取失败")
        return
    }
    var newFile = new FileParser(rbuf)

    // 为了使用像素进行自定义操作，使用 canvas 作为子容器承载 Image dom
    var canvas = document.createElement('canvas');
    canvas.width = imageObj.width
    canvas.height = imageObj.height
    var ctx = canvas.getContext('2d');
    ctx.drawImage(imageObj, 0, 0)

    var Img = new Konva.Image({
        name: 'image',
        image: canvas,
        x: stage.width() / 2 - imageObj.width / 2,
        y: stage.height() / 2 - imageObj.height / 2,
        width: imageObj.width,
        height: imageObj.width,
        draggable: true
    });

    graphNow = Img
    console.log(Img._id)
   
    // 存放源文件属性
    ddrawShape[Img._id] = {
        'header': newFile.bmpFile.BITMAPFILEHEADER,
        'info' : newFile.bmpFile.BITMAPINFO,
        
    }

    // 添加属性 即各种图像处理后的像素矩阵,提前生成，方便替换 canvas 视图

    // 添加原图像
    let catx = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    let imdata = catx.data

    Img.srcImage = imdata

    // 加权平均灰度化
    Img.grayImage = weightGray(imdata)

    // 平均灰度化
    Img.meangrayImage = meanGray(imdata)

    // 添加 rgb 或 gray 标记

    Img.type = 'rgb'

    // 画 RGB 直方图
    // 清空现有直方图
    clearHistogram()

    let hisdata = histogramData(imdata)

    // console.log(hisdata)
    drawHistogram("rchart", hisdata.rNumber, "直方图R", ['#ff0000'], hisdata.rmax);
    drawHistogram("gchart", hisdata.gNumber, "直方图G", ['#00ff00'], hisdata.gmax);
    drawHistogram("bchart", hisdata.bNumber, "直方图B", ['#0000ff'], hisdata.bmax);

    Img.on('dragmove', function () {

        bmpx.value = this.attrs.x
        bmpy.value = this.attrs.y
    })

    Img.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });

    Img.on('mouseout', function () {
        document.body.style.cursor = 'default';
    });
    layer.add(Img);

    layer.draw();
    Img.on('dblclick', function () {
        // 双击删除自己
        this.remove();
        // 遍历移除图形选择框
        // stage.find('Transformer').destroy();

        let trans = stage.find('Transformer')

        for (let i = 0; i < trans.length; ++i) {

            trans[i].destroy()
        }

        // 移除选中信息
        bmpid.value = ""
        bmpindex.value = ""
        bmpx.value = ""
        bmpy.value = ""

        // 双击时 graphNow 必然是 this
        graphNow = null

        // 清空直方图
        clearHistogram()

        layer.draw();
    });


    // console.log(p.bmpFile)

}



/**
 * 铅笔
 * @param points 点数组
 * @param stroke 颜色
 * @param strokeWidth 线粗细
 */
function drawPencil(points, stroke, strokeWidth) {
    const line = new Konva.Line({
        name: 'line',
        points: points,
        stroke: stroke,
        strokeWidth: strokeWidth,
        lineCap: 'round',
        lineJoin: 'round',
        tension: 0.5,
        draggable: true
    });
    graphNow = line;
    layer.add(line);
    layer.draw();

    line.on('mouseenter', function () {
        stage.container().style.cursor = 'move';
    });

    line.on('mouseleave', function () {
        stage.container().style.cursor = 'default';
    });

    line.on('dblclick', function () {
        // 双击删除自己
        this.remove();
        // 遍历移除图形选择框
        // stage.find('Transformer').destroy();

        let trans = stage.find('Transformer')

        for (let i = 0; i < trans.length; ++i) {

            trans[i].destroy()
        }
        layer.draw();
    });
}


/**
 * 矩形
 * @param x x坐标
 * @param y y坐标
 * @param w 宽
 * @param h 高
 * @param c 颜色
 * @param sw 该值大于0-表示空心矩形（描边宽），等于0-表示实心矩形
 */
function drawRect(x, y, w, h, c, sw) {
    const rect = new Konva.Rect({
        name: 'rect',
        x: x,
        y: y,
        width: w,
        height: h,
        fill: sw === 0 ? c : null,
        stroke: sw > 0 ? c : null,
        strokeWidth: sw,
        opacity: sw === 0 ? 0.5 : 1,
        draggable: true
    });
    graphNow = rect;
    layer.add(rect);
    layer.draw();

    rect.on('mouseenter', function () {
        stage.container().style.cursor = 'move';
    });

    rect.on('mouseleave', function () {
        stage.container().style.cursor = 'default';
    });

    rect.on('dblclick', function () {
        // 双击删除自己
        this.remove();
        // 遍历移除图形选择框
        // stage.find('Transformer').destroy();

        let trans = stage.find('Transformer')

        for (let i = 0; i < trans.length; ++i) {

            trans[i].destroy()
        }
        layer.draw();
    });
}


/**
 * 椭圆
 * @param x x坐标
 * @param y y坐标
 * @param rx x半径
 * @param ry y半径
 * @param stroke 描边颜色
 * @param strokeWidth 描边大小
 */
function drawEllipse(x, y, rx, ry, stroke, strokeWidth) {
    const ellipse = new Konva.Ellipse({
        name: 'ellipse',
        x: x,
        y: y,
        radiusX: rx,
        radiusY: ry,
        stroke: stroke,
        strokeWidth: strokeWidth,
        draggable: true
    });
    graphNow = ellipse;
    layer.add(ellipse);
    layer.draw();

    ellipse.on('mouseenter', function () {
        stage.container().style.cursor = 'move';
    });

    ellipse.on('mouseleave', function () {
        stage.container().style.cursor = 'default';
    });

    ellipse.on('dblclick', function () {
        // 双击删除自己
        this.remove();
        // 遍历移除图形选择框
        // stage.find('Transformer').destroy();

        let trans = stage.find('Transformer')

        for (let i = 0; i < trans.length; ++i) {

            trans[i].destroy()
        }
        layer.draw();
    });
}

/**
 * stage鼠标按下
 * @param flag 是否可绘制
 * @param ev 传入的event对象
 */
function stageMousedown(flag, ev) {
    if (flag) {
        let x = ev.evt.offsetX, y = ev.evt.offsetY;
        pointStart = [x, y];

        switch (flag) {
            case 'pencil':
                drawPencil(pointStart, graphColor, 2);
                break;
            case 'ellipse':
                // 椭圆
                drawEllipse(x, y, 0, 0, graphColor, 2);
                break;
            case 'rect':
                drawRect(x, y, 0, 0, graphColor, 0);
                break;
            case 'rectH':
                drawRect(x, y, 0, 0, graphColor, 2);
                break;
            case 'text':
                drawText(x, y, graphColor, 16);
                break;
            default:
                break;
        }
        drawing = true;
    }
}


/**
 * stage鼠标移动
 * @param flag 是否可绘制
 * @param ev 传入的event对象
 */
function stageMousemove(flag, ev) {
    switch (flag) {
        case 'pencil':
            // 铅笔
            pointStart.push(ev.evt.offsetX, ev.evt.offsetY);
            graphNow.setAttrs({
                points: pointStart
            });
            break;
        case 'ellipse':
            // 椭圆
            graphNow.setAttrs({
                radiusX: Math.abs(ev.evt.offsetX - pointStart[0]),
                radiusY: Math.abs(ev.evt.offsetY - pointStart[1])
            });
            break;
        case 'rect':
        case 'rectH':
            graphNow.setAttrs({
                width: ev.evt.offsetX - pointStart[0],
                height: ev.evt.offsetY - pointStart[1]
            });
            break;
        default:
            break;
    }
    layer.draw();
}

/** 
 * 更新图片属性面板
 * 
*/
function updateImageinfoPan() {

}
