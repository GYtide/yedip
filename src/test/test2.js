const fs = require('fs')
const path = require('path')
const { FileParser } = require('E:/_todo/dip_expe/yedip/src/store/Fileloader.js')

try {
    //读取文件
    var rbuf = fs.readFileSync('res/ln.BMP');
    // console.log(rbuf);
} catch (err) {
    console.log(err);
}
var fileloader = new FileParser(rbuf)

console.log(fileloader.bmpFile)