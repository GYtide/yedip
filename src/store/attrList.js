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

        let srcImage = graphNow.srcImage

        let cans = graphNow.getImage().getContext('2d')

        let catx = cans.getImageData(0, 0, cans.canvas.width, cans.canvas.height)

        let imdata = catx.data
        // console.log(imdata)

        // imdata = graphNow.srcImage

        // console.log(imdata)
        for (let i = 0; i < imdata.length; i += 4) {
            imdata[i] = srcImage[i]
            imdata[i + 1] = srcImage[i + 1]
            imdata[i + 2] = srcImage[i + 2]
        }

        cans.putImageData(catx, 0, 0)
        layer.draw();

    }
}