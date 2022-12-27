function drawImage(imageObj) {

    var srcstring = imageObj.src
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

    try {
        var newFileloader = new FileParser(rbuf)
    }catch (err){
        console.log(err);
        alert("文件读取失败,位图数据异常",err)
        return
    }
    
    var newFile = newFileloader.getFile()


    var newImage = newFile.getImage()


    // 为了使用像素进行自定义操作，使用 canvas 作为子容器承载 Image dom
    var canvas = document.createElement('canvas');
    canvas.width = newImage.width
    canvas.height = newImage.height
    var ctx = canvas.getContext('2d');

    
    let catx = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    let imdata = catx.data


    let newdata = newImage.data

    for (let j = 0; j < newImage.height; ++j) {

        for (let i = 0; i < newImage.width; ++i) {

            imdata[(j * newImage.width + i) * 4] = newdata[(j * newImage.width + i) * 4]
            imdata[(j * newImage.width + i) * 4 + 1] = newdata[(j * newImage.width + i) * 4 + 1]
            imdata[(j * newImage.width + i) * 4 + 2] = newdata[(j * newImage.width + i) * 4 + 2]
            imdata[(j * newImage.width +   i) * 4 + 3] = newdata[(j * newImage.width + i) * 4 + 3]
        }
    }

    ctx.putImageData(catx, 0, 0)

    let newwidth = newImage.width
    let srcwidth = newImage.width
    let newheight = newImage.height
    let srcheight = newImage.height
    let zoomRatio = 1

    if(newwidth > stage.width()*0.8 || newheight > stage.height()*0.8){
        // 缩放
        console.log(Math.floor( stage.width()*0.8/newwidth * 10 )/10 , Math.floor(stage.height()*0.8/newheight * 10)/10)
        // 确定缩放比例，
        if(Math.floor( stage.width()*0.8/newwidth * 10 )/10 < Math.floor(stage.height()*0.8/newheight * 10)/10){
            zoomRatio = Math.floor(  stage.width()*0.8/newwidth * 10 )/10
        }
        else{
            zoomRatio = Math.floor( stage.height()*0.8/newheight * 10)/10
        }

    }

    // 进行缩放
    console.log(zoomRatio)
    if(zoomRatio <= 0.3 ){
        alert ('图片过大无法正常显示')
        return
    }
    newwidth *= zoomRatio
    newheight *= zoomRatio

    
    
    var Img = new Konva.Image({
        name: 'image',
        image: canvas,
        x: stage.width() / 2 - newwidth / 2,
        y: stage.height() / 2 - newheight / 2,
        width: newwidth,
        height: newheight,
        draggable: true,
        stroke: (223,222,222),
        strokeWidth: 0,
        dash: [10, 10],
    });
    
    
    
    unsetgraphNow()
    Img.zoomRatio = zoomRatio
    Img.srcwidth = srcwidth
    Img.srcheight = srcheight
    
    graphNow = Img

    // console.log(Img._id)


    // 存放源文件属性
    drawShape[Img._id] = {
        'src': srcstring,
        'header': newFile.BITMAPFILEHEADER,
        'info': newFile.BITMAPINFO,
    }

    updateImageinfoPan()

  
    // console.log(drawShape)

    // 添加属性 即各种图像处理后的像素矩阵,提前生成，方便替换 canvas 视图

    // 添加原图像
    Img.srcImage = imdata

    // 加权平均灰度化
    Img.grayImage = weightGray(imdata)

    // 平均灰度化
    Img.meangrayImage = meanGray(imdata)

    // 添加 rgb 或 gray 标记

    Img.type = 'rgb'

    // 画 RGB 直方图
    // 清空现有直方图

    
    Img.on('dragmove', function () {
        
        bmpx.value = Math.round(this.attrs.x)
        bmpy.value = Math.round(this.attrs.y)
    })
    
    Img.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });
    
    Img.on('mouseout', function () {
        document.body.style.cursor = 'default';
    });
    layer.add(Img);
    
    let trans = stage.find('Transformer')
    
    for (let i = 0; i < trans.length; ++i) {
        trans[i].destroy()
    }
    
    setgraphNow()

    // 添加 tansformer
    // if (transformer.checked) {
    //     const tr = new Konva.Transformer({
    //         borderStroke: '#000', // 虚线颜色
    //         borderStrokeWidth: 1, //虚线大小
    //         borderDash: [5], // 虚线间距
    //         keepRatio: false // 不等比缩放
    //     });
    //     layer.add(tr);
    //     tr.attachTo(Img);

    // }

    layer.draw();

    Img.on('contextmenu',function(e){
        menuNode.style.display = 'none';
        imagemenuNode.style.display = 'none'
     
        if (e.target.name() == 'image') {
            e.evt.preventDefault();
   
            imagemenuNode.style.display = 'initial';
            var containerRect = stage.container().getBoundingClientRect();
            imagemenuNode.style.top =
                containerRect.top + stage.getPointerPosition().y + 4 + 'px';
                imagemenuNode.style.left =
                containerRect.left + stage.getPointerPosition().x + 4 + 'px';
        }
    })

    // Img.on('dblclick',function(e){
    //     menuNode.style.display = 'none';
    //     imagemenuNode.style.display = 'none'
     
    //     if (e.target.name() == 'image') {
    //         e.evt.preventDefault();
    //         console.log(e)
   
    //         imagemenuNode.style.display = 'initial';
    //         var containerRect = stage.container().getBoundingClientRect();
    //         imagemenuNode.style.top =
    //             containerRect.top + stage.getPointerPosition().y + 4 + 'px';
    //             imagemenuNode.style.left =
    //             containerRect.left + stage.getPointerPosition().x + 4 + 'px';
    //     }
    // })
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
        bmpwidth.value = ""
        bmpheight.value = ""
        bmpx.value = ""
        bmpy.value = ""

        // 双击时 graphNow 必然是 this
        unsetgraphNow()

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
 * 更新图片属性面板, 将 graphNow 的文件属性显示在图片属性面板
 * 
*/
function updateImageinfoPan() {

    const infoTable = {
        fname: document.getElementById('fname'),
        bfType: document.getElementById('bfType'),
        bfSize: document.getElementById('bfSize'),
        bfOffBits: document.getElementById('bfOffBits'),
        biSize: document.getElementById('biSize'),
        biWidth: document.getElementById('biWidth'),
        biHeight: document.getElementById('biHeight'),
        biPlanes: document.getElementById('biPlanes'),
        biBitCount: document.getElementById('biBitCount'),
        biCompression: document.getElementById('biCompression'),
        biClrUsed: document.getElementById('biClrUsed')
    }
    if (!graphNow) {
        infoTable.fname.value = infoTable.bfType.value = infoTable.bfSize.value =
            infoTable.bfOffBits.value = infoTable.biSize.value = infoTable.biWidth.value =
            infoTable.biHeight.value = infoTable.biPlanes.value = infoTable.biBitCount.value =
            infoTable.biCompression.value = infoTable.biClrUsed.value = ""
    }
    else {
        //    drawShape[Img._id] = {
        // 'src': srcstring,
        // 'header': newFile.bmpFile.BITMAPFILEHEADER,
        // 'info': newFile.bmpFile.BITMAPINFO,
        // 'colorMap': newFile.bmpFile.tagRGBQUAD

        let id = graphNow._id
        infoTable.fname.value = drawShape[id].src
        infoTable.bfType.value = drawShape[id].header.bfType
        infoTable.bfSize.value = drawShape[id].header.bfSize
        infoTable.bfOffBits.value = drawShape[id].header.bfOffBits
        infoTable.biSize.value = drawShape[id].info.biSize
        infoTable.biWidth.value = drawShape[id].info.biWidth
        infoTable.biHeight.value = drawShape[id].info.biHeight
        infoTable.biPlanes.value = drawShape[id].info.biPlanes
        infoTable.biBitCount.value = drawShape[id].info.biBitCount
        infoTable.biCompression.value = drawShape[id].info.biCompression
        infoTable.biClrUsed.value = drawShape[id].info.biClrUsed

    }

}

/**
 * 添加 高斯噪声addGaussiannoise
 */

function addGaussiannoise() {
    if (graphNow) {
        if (graphNow.type == 'gray' || graphNow.type == 'bin') {
            let cans = graphNow.getImage().getContext('2d')

            let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

            let imdata = catx.data
            let tmpdata = []
            // 取出灰度图的一个通道
            for(let i = 0 ,j = 0; i< imdata.length; i+=4 , j+=1){
                tmpdata[j] = imdata[i]
            }
            // console.log(tmpdata)
            Gaussiannoise(tmpdata,cans.canvas.width,cans.canvas.height,0,10)

            // console.log(tmpdata)


            // 写回原数组
            for(let i = 0 ,j = 0; i< imdata.length; i+=4 , j+=1){
               imdata[i] = imdata[i+1] =  imdata[i+2] =  tmpdata[j]
            }

            // 画出直方图
            clearHistogram()
            let hisdata = histogramData(imdata)
            // 画出灰度直方图
            drawHistogram("graychart", hisdata.rNumber, "灰度直方图", ['#111111'], hisdata.rmax);

            cans.putImageData(catx, 0, 0)
            layer.draw();
        }
        else{
            let cans = graphNow.getImage().getContext('2d')

            let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

            let imdata = catx.data

            // 取出每一个通道的数据分别进行滤波

            let tmprdata = []
            // 取出灰度图的一个通道
            for(let i = 0 ,j = 0; i< imdata.length; i+=4 , j+=1){
                tmprdata[j] = imdata[i]
            }
            let tmpgdata = []
            // 取出灰度图的一个通道
            for(let i = 1 ,j = 0; i< imdata.length; i+=4 , j+=1){
                tmpgdata[j] = imdata[i]
            }
            let tmpbdata = []
            // 取出灰度图的一个通道
            for(let i = 2 ,j = 0; i< imdata.length; i+=4 , j+=1){
                tmpbdata[j] = imdata[i]
            }

            Gaussiannoise(tmprdata,cans.canvas.width,cans.canvas.height,0,10)
            Gaussiannoise(tmpgdata,cans.canvas.width,cans.canvas.height,0,10)
            Gaussiannoise(tmpbdata,cans.canvas.width,cans.canvas.height,0,10)

            // 写回源数组

            for(let i = 0 ,j = 0; i< imdata.length; i+=4 , j+=1){
                imdata[i] = tmprdata[j]
                imdata[i+1] = tmpgdata[j]
                imdata[i+2] = tmpbdata[j]
             }
            // 画出直方图
            clearHistogram()
            let hisdata = histogramData(imdata)
            // 画出灰度直方图
            drawHistogram("rchart", hisdata.rNumber, "直方图R", ['#ff0000'], hisdata.rmax);
            drawHistogram("gchart", hisdata.gNumber, "直方图G", ['#00ff00'], hisdata.gmax);
            drawHistogram("bchart", hisdata.bNumber, "直方图B", ['#0000ff'], hisdata.bmax);
    

            cans.putImageData(catx, 0, 0)
            layer.draw();
        }
    }

}

/**
 * 添加 椒盐噪声addPretzelnoise
 */

function addPretzelnoise() {
    if (graphNow) {
        if (graphNow.type == 'gray' || graphNow.type == 'bin') {
            let cans = graphNow.getImage().getContext('2d')

            let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

            let imdata = catx.data
            // 添加噪声
            Pretzelnoise(imdata, 'gray')

            // 画出直方图
            clearHistogram()
            let hisdata = histogramData(imdata)
            // 画出灰度直方图
            drawHistogram("graychart", hisdata.rNumber, "灰度直方图", ['#111111'], hisdata.rmax);

            cans.putImageData(catx, 0, 0)
            layer.draw();
        }
        else {
            // 不是灰度图先进行灰度化
            let cans = graphNow.getImage().getContext('2d')

            let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

            let imdata = catx.data
            Pretzelnoise(imdata, 'rgb')
            // 画出直方图
            clearHistogram()
            let hisdata = histogramData(imdata)
            // 画出灰度直方图
            drawHistogram("rchart", hisdata.rNumber, "直方图R", ['#ff0000'], hisdata.rmax);
            drawHistogram("gchart", hisdata.gNumber, "直方图G", ['#00ff00'], hisdata.gmax);
            drawHistogram("bchart", hisdata.bNumber, "直方图B", ['#0000ff'], hisdata.bmax);


            cans.putImageData(catx, 0, 0)
            layer.draw();
        }
    }
}

/**
 *  均值滤波 Meanvaluefiltering
 */

function Meanvaluefiltering() {
    if (graphNow) {
        if (graphNow.type == 'gray' || graphNow.type == 'bin') {
            let cans = graphNow.getImage().getContext('2d')

            let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

            let imdata = catx.data
            let tmpdata = []
            // 取出灰度图的一个通道
            for (let i = 0, j = 0; i < imdata.length; i += 4, j += 1) {
                tmpdata[j] = imdata[i]
            }
            // console.log(tmpdata)
            Meanvaluefilter(tmpdata, cans.canvas.width, cans.canvas.height)



            // 写回原数组
            for (let i = 0, j = 0; i < imdata.length; i += 4, j += 1) {
                imdata[i] = imdata[i + 1] = imdata[i + 2] = tmpdata[j]
            }

            // 画出直方图
            clearHistogram()
            let hisdata = histogramData(imdata)
            // 画出灰度直方图
            drawHistogram("graychart", hisdata.rNumber, "灰度直方图", ['#111111'], hisdata.rmax);

            cans.putImageData(catx, 0, 0)
            layer.draw();
        }
        else {
            let cans = graphNow.getImage().getContext('2d')

            let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

            let imdata = catx.data

            // 取出每一个通道的数据分别进行滤波

            let tmprdata = []
            // 取出R通道
            for (let i = 0, j = 0; i < imdata.length; i += 4, j += 1) {
                tmprdata[j] = imdata[i]
            }
            let tmpgdata = []
            // 取出G通道
            for (let i = 1, j = 0; i < imdata.length; i += 4, j += 1) {
                tmpgdata[j] = imdata[i]
            }
            let tmpbdata = []
            // 取出B通道
            for (let i = 2, j = 0; i < imdata.length; i += 4, j += 1) {
                tmpbdata[j] = imdata[i]
            }

            Meanvaluefilter(tmprdata, cans.canvas.width, cans.canvas.height)
            Meanvaluefilter(tmpgdata, cans.canvas.width, cans.canvas.height)
            Meanvaluefilter(tmpbdata, cans.canvas.width, cans.canvas.height)

            // 写回源数组

            for (let i = 0, j = 0; i < imdata.length; i += 4, j += 1) {
                imdata[i] = tmprdata[j]
                imdata[i + 1] = tmpgdata[j]
                imdata[i + 2] = tmpbdata[j]
            }
            // 画出直方图
            clearHistogram()
            let hisdata = histogramData(imdata)
            // 画出灰度直方图
            drawHistogram("rchart", hisdata.rNumber, "直方图R", ['#ff0000'], hisdata.rmax);
            drawHistogram("gchart", hisdata.gNumber, "直方图G", ['#00ff00'], hisdata.gmax);
            drawHistogram("bchart", hisdata.bNumber, "直方图B", ['#0000ff'], hisdata.bmax);


            cans.putImageData(catx, 0, 0)
            layer.draw();
        }
    }
}

/**
 * 中值滤波 Medianvaluefiltering
 * 
 */

function Medianvaluefiltering() {
    if (graphNow) {
        if (graphNow.type == 'gray' || graphNow.type == 'bin') {
            let cans = graphNow.getImage().getContext('2d')

            let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

            let imdata = catx.data
            let tmpdata = []
            // 取出灰度图的一个通道
            for (let i = 0, j = 0; i < imdata.length; i += 4, j += 1) {
                tmpdata[j] = imdata[i]
            }
            // console.log(tmpdata)
            Medianvaluefilter(tmpdata, cans.canvas.width, cans.canvas.height)



            // 写回原数组
            for (let i = 0, j = 0; i < imdata.length; i += 4, j += 1) {
                imdata[i] = imdata[i + 1] = imdata[i + 2] = tmpdata[j]
            }

            // 画出直方图
            clearHistogram()
            let hisdata = histogramData(imdata)
            // 画出灰度直方图
            drawHistogram("graychart", hisdata.rNumber, "灰度直方图", ['#111111'], hisdata.rmax);

            cans.putImageData(catx, 0, 0)
            layer.draw();
        }
        else {
            let cans = graphNow.getImage().getContext('2d')

            let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

            let imdata = catx.data

            // 取出每一个通道的数据分别进行滤波

            let tmprdata = []
            // 取出灰度图的一个通道
            for (let i = 0, j = 0; i < imdata.length; i += 4, j += 1) {
                tmprdata[j] = imdata[i]
            }
            let tmpgdata = []
            // 取出灰度图的一个通道
            for (let i = 1, j = 0; i < imdata.length; i += 4, j += 1) {
                tmpgdata[j] = imdata[i]
            }
            let tmpbdata = []
            // 取出灰度图的一个通道
            for (let i = 2, j = 0; i < imdata.length; i += 4, j += 1) {
                tmpbdata[j] = imdata[i]
            }

            Medianvaluefilter(tmprdata, cans.canvas.width, cans.canvas.height)
            Medianvaluefilter(tmpgdata, cans.canvas.width, cans.canvas.height)
            Medianvaluefilter(tmpbdata, cans.canvas.width, cans.canvas.height)

            // 写回源数组

            for (let i = 0, j = 0; i < imdata.length; i += 4, j += 1) {
                imdata[i] = tmprdata[j]
                imdata[i + 1] = tmpgdata[j]
                imdata[i + 2] = tmpbdata[j]
            }
            // 画出直方图
            clearHistogram()
            let hisdata = histogramData(imdata)
            // 画出灰度直方图
            drawHistogram("rchart", hisdata.rNumber, "直方图R", ['#ff0000'], hisdata.rmax);
            drawHistogram("gchart", hisdata.gNumber, "直方图G", ['#00ff00'], hisdata.gmax);
            drawHistogram("bchart", hisdata.bNumber, "直方图B", ['#0000ff'], hisdata.bmax);


            cans.putImageData(catx, 0, 0)
            layer.draw();
        }
    }
}

