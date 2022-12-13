// 位图文件头 bitmap-file header
function BITMAPFILEHEADER(bfType, bfSize, bfReserved1, bfReserved2, bfOffBits) {

    // 2字节 位图类别，根据不同的操作系统而不同，在Windows中，此字段的值总为‘BM’
    this.bfType = bfType

    // 4字节 BMP图像文件的大小
    this.bfSize = bfSize

    // 2字节 总是为 0
    this.bfReserved1 = bfReserved1
    // 2字节 总是为 0
    this.bfReserved2 = bfReserved2

    //4字节 BMP图像数据的地址 （从文件头到实际位图文件的偏移量）
    this.bfOffBits = bfOffBits
}


// 位图信息头 bitmap-information header
function BITMAPINFO(biSize, biWidth, biHeight, biPlanes, biBitCount,
    biCompression, biSizeImage, biXPelsPerMeter, biYPelsPerMeter, biClrUsed, biClrImportant) {

    // 4字节 本结构的大小，根据不同的操作系统而不同，在Windows中，此字段的值总为28h字节=40字节
    this.biSize = biSize

    // 4字节 BMP图像的宽度，单位像素
    this.biWidth = biWidth

    // 4字节 BMP图像的高度，单位像素
    this.biHeight = biHeight

    // 2字节 位平面数
    this.biPlanes = biPlanes

    // 2字节  BMP图像的色深，即一个像素用多少位表示，常见有1、4、8、16、24和32，
    //分别对应单色、16色、256色、16位高彩色、24位真彩色和32位增强型真彩色
    this.biBitCount = biBitCount

    // 4字节 压缩方式，0表示不压缩，1表示RLE8压缩，2表示RLE4压缩，3表示每个像素值由指定的掩码决定
    this.biCompression = biCompression

    // 4字节 BMP图像数据大小，必须是4的倍数，图像数据大小不是4的倍数时用0填充补足
    this.biSizeImage = biSizeImage

    // 4字节 水平分辨率，单位像素/m
    this.biXPelsPerMeter = biXPelsPerMeter

    // 4字节 垂直分辨率，单位像素/m
    this.biYPelsPerMeter = biYPelsPerMeter

    // 4字节 BMP图像使用的颜色，0表示使用全部颜色，对于256色位图来说，此值为100h=256
    this.biClrUsed = biClrUsed

    // 4字节 重要的颜色数，此值为0时所有颜色都重要，对于使用调色板的BMP图像来说，当显卡不能够显示所有颜色时，此值将辅助驱动程序显示颜色
    this.biClrImportant = biClrImportant

}

// 彩色表/调色板（color table）
function tagRGBQUAD(rgbBlue, rgbGreen, rgbRed, rgbReserved) {

    // R分量
    this.rgbBlue = rgbBlue

    // G 分量
    this.rgbGreen = rgbGreen

    // B 分量
    this.rgbRed = rgbRed

    // 保留字
    this.rgbReserved = rgbReserved
}


// 位图类
class Dip {

    constructor(BITMAPFILEHEADER, BITMAPINFO, tagRGBQUAD, bitMapData) {

        //位图文件头 bitmap-file header
        this.BITMAPFILEHEADER = BITMAPFILEHEADER

        //位图信息头 bitmap-information header
        this.BITMAPINFO = BITMAPINFO

        // 彩色表/调色板（color table）
        this.tagRGBQUAD = tagRGBQUAD

        // 位图数据
        this.bitMapData = bitMapData

    }
}


export {
    BITMAPFILEHEADER,
    BITMAPINFO,
    tagRGBQUAD,
    Dip
}

