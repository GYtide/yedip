import * as fs from 'fs'

import {BITMAPFILEHEADER} from '../filehandle/Dip.mjs'


// var bmpheader = require('../filehandle/Dip')cd
//  解析文件头

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

function getHeader(headerBitStream)
{

    // 2字节 位图类别，根据不同的操作系统而不同，在Windows中，此字段的值总为‘BM’
    let bfType = headerBitStream.slice(0, 2)

    // 4字节 BMP图像文件的大小
    let sizeBitStream = headerBitStream.slice(2, 6)

    let bfSize = 0

    // 十六进制转十进制
    for (var i = 0; i < 4; ++i) {

        let sizet = sizeBitStream[i]

        for (var j = 0; j < i; ++j) {

            sizet = sizet * 256
        }
        // console.log(sizet)

        bfSize = bfSize + sizet
    }

    // 2字节 总是为 0
    let bfReserved1 = headerBitStream.slice(6, 8)
    // 2字节 总是为 0
    let bfReserved2 = headerBitStream.slice(8, 10)

    //4字节 BMP图像数据的地址 （从文件头到实际位图文件的偏移量）
    let bfOffBitsStream = headerBitStream.slice(10, 14)

    let bfOffBits = 0

    // 十六进制转十进制
    
    bfOffBits = hex2dec(bfOffBitsStream,4)
    var header = new BITMAPFILEHEADER(bfType,bfSize,bfReserved1,bfReserved2,bfOffBits)

    return header

}


var rbuf = fs.readFileSync("ln.BMP");


let headerBitStream = rbuf.slice(0, 14)


// sbmpheader = getHeader(headerBitStream)

var headers = getHeader(headerBitStream)

console.log(headers)
 
