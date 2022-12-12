var fs = require('fs');
import { Dip, BITMAPFILEHEADER, BITMAPINFO, tagRGBQUAD } from '../filehandle/Dip.mjs'

export class FileLoader {

    constructor(file_url) {
        this.file_url = file_url
        
    }

    OpenFile() {
        try {
            //读取文件
            var rbuf = fs.readFileSync(this.file_url);
            // console.log(rbuf);
        } catch (err) {
            console.log(err);
        }


    }

    // 对文件二进制流进行解析,
    handleFile(fileBitStream) {
        let headerBitStream = fileBitStream.slice(0, 14)

        let Header = this.getHeader(headerBitStream)

        let infoBitStream = fileBitStream.slice(14, 54)

        let Info = this.getInfo(infoBitStream)

    }

    //  解析文件头
    getHeader(headerBitStream) {

        // 2字节 位图类别，根据不同的操作系统而不同，在Windows中，此字段的值总为‘BM’
        let bfType = headerBitStream.slice(0, 2)

        // 4字节 BMP图像文件的大小
        let sizeBitStream = headerBitStream.slice(2, 6)

        let bfSize = 0

        // 十六进制转十进制
        
        bfSize = hex2dec(sizeBitStream,4)

        // 2字节 总是为 0
        let bfReserved1 = headerBitStream.slice(6, 8)
        // 2字节 总是为 0
        let bfReserved2 = headerBitStream.slice(8, 10)

        //4字节 BMP图像数据的地址 （从文件头到实际位图文件的偏移量）
        let bfOffBitsStream = headerBitStream.slice(10, 14)

        let bfOffBits = 0

        // 十六进制转十进制
      
        bfOffBits = hex2dec(bfOffBitsStream,4)

        var header = new BITMAPFILEHEADER(bfType, bfSize, bfReserved1, bfReserved2, bfOffBits)

        return header

    }

    // 解析文件信息头
    getInfo(infoBitStream) {

        // 获取信息头大小根据不同的操作系统而不同，在Windows中，此字段的值总为28h字节=40字节

        let biSizeStream = infoBitStream.slice(0, 4)

        let biSize = hex2dec(biSizeStream,4)

        // 获取 BMP 图像的宽度 ，单位像素

        let biWidthStream = infoBitStream.slice(4, 8)
        let biWidth = hex2dec(biWidthStream,4)

        // 获取 BMP 图像的高度 ， 单位像素

        let biHeightStream = infoBitStream.slice(8, 12)
        let biHeight = hex2dec(biHeightStream,4)

        // 位平面数

        let biPlanesStream = infoBitStream.slice(12, 14)

        let biPlanes = hex2dec(biPlanesStream,2)


        // 色深

        let biBitCountStream = infoBitStream.slice(14, 16)

        let biBitCount = hex2dec(biBitCountStream,2)

        // 压缩方式压缩方式，0表示不压缩，1表示RLE8压缩，2表示RLE4压缩，3表示每个像素值由指定的掩码决定

        let biCompressionStream = infoBitStream.slice(16, 20)

        let biCompressionNum = hex2dec(biCompressionStream,4)

        let biCompression = 'noCompress'

      
        // 未压缩 = 0
        if (biCompressionNum == 0) {
            biCompression = 'noCompress'
        }
        else if (biCompressionNum == 1) {
            biCompression = 'RLE8'
        }
        else if (biCompressionNum == 2) {
            biCompression = 'RLE4'
        }


        // 获取图像数据大小

        let biSizeImageStream = infoBitStream.slice(20, 24)

        let biSizeImage = hex2dec(biSizeImageStream,4)

        // 位图水平分辨率

        let biXPelsPerMeterStream = infoBitStream.slice(24,28)

        let biXPelsPerMeter = hex2dec(biXPelsPerMeterStream,4)

        // 位图垂直分辨率

        let biYPelsPerMeterStream = infoBitStream.slice(28,32)

        let biYPelsPerMeter = hex2dec(biYPelsPerMeterStream,4)
        
        // 位图使用颜色数

        let biClrUsedStream = infoBitStream.slice(32,36)

        let biClrUsed = hex2dec(biClrUsedStream,4)

        // 位图使用的重要颜色数

        let biClrImportantStream = infoBitStream.slice(36,40)

        let biClrImportant = hex2dec(biClrImportantStream,4)

        var infoheader = new BITMAPINFO(biSize, biWidth, biWidth, biPlanes, biBitCount,biCompression,biSizeImage,
            biXPelsPerMeter,biYPelsPerMeter,biClrUsed,biClrImportant)

    }
    
    // 获取色表（调色板）
    getColorMap(colorBitStream) {

        let biClrUsedSize = colorBitStream.length / 4

        // console.log(colorStream.length)

        let colorMap = []
        
        for(let i = 0; i < biClrUsedSize ; ++i)
        {
            let tmpColor = colorStream.slice(4*i,4*i+4)

            colorMap[i] = {'R':tmpColor[0],'G':tmpColor[1],'B':tmpColor[2],'A':tmpColor[3]}
        
        }

        return colorMap


    }

    // 解析数据
    getData(dataBitStream,width,height) {

        let bitMapData = [width][height]

        for(let i = 0 ; i < width ; ++i)
        {

            for(let j = 0 ; j < height ; ++j)
            {
                 
            }
        }

    }

}

function hex2dec(hexstream, bits, lor = 0) {

    // lor == 0 为小端（高位字节在高地址） lor != 0 为大端 （高位字节在低地址）

    let decnum = 0

    if (lor == 0) {

        // 小端 低位在低，高位在高

        for (let i = 0; i < bits; ++i) {

            let tmp = hexstream[i];

            for (let j = 0; j < i; ++j) {
                tmp = tmp * 256
            }

            decnum = decnum + tmp
        }

    }
    else
    {

        for(let i = 0 ; i < bits ; ++i)
        {
            let tmp = hexstream[i];

            for(let j = 0; j < bits - i ;++j)
            {
                tmp = tmp * 256

            }

            decnum = decnum + tmp
        }

    }
    return decnum;


}