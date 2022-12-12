// import * as fs from 'fs'

import { BITMAPFILEHEADER } from '../filehandle/Dip.mjs'


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
    else {

        for (let i = 0; i < bits; ++i) {
            let tmp = hexstream[i];

            for (let j = 0; j < bits - i; ++j) {
                tmp = tmp * 256

            }

            decnum = decnum + tmp
        }

    }
    return decnum;


}


var rbuf = fs.readFileSync("ln.BMP");

let colorStream = rbuf.slice(54, 256 * 4 + 54)


let biClrUsedSize = colorStream.length / 4

// console.log(colorStream.length)

let colorMap = []

for (let i = 0; i < biClrUsedSize; ++i) {
    let tmpColor = colorStream.slice(4 * i, 4 * i + 4)

    colorMap[i] = { 'R': tmpColor[0], 'G': tmpColor[1], 'B': tmpColor[2], 'A': tmpColor[3] }
}

// console.log(colorMap)

let dataStream = rbuf.slice(256*4+54,256*256+256*4+54)

// console.log(dataStream.length)

let width = 256

let height = 256

if(width*height == dataStream.length)
{
    let  bitMapData = []

    for(let i = 0 ; i < width ; ++i)
    {
    
        for(let j = 0 ; j < height ; ++j)
        {
             bitMapData[i][j] = 0
    
        }
    }


    for(let i = 0 ; i < width ; ++i)
    {
    
        for(let j = 0 ; j < height ; ++j)
        {
             bitMapData[width - i -1][height - j - 1] = dataStream[i*256+j]
    
        }
    }
    
    console.log(bitMapData)
    
}
