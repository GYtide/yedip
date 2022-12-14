const {FileParser} = require('../store/Fileloader')
const fs = require('fs')
try {
    //读取文件
    var rbuf = fs.readFileSync('E:/_todo/dip_expe/yedip/src/test/ln.BMP');
    // console.log(rbuf);
} catch (err) {
    console.log(err);
}

var fileloader = new FileParser(rbuf)

console.log(fileloader.bmpFile.BITMAPINFO)
