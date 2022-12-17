const fs = require('fs')
    const path = require('path')
    const { FileParser } = require(path.join(path.resolve(__dirname,'..'), 'store', 'Fileloader.js'))


var imageObj = {src : path.join(path.resolve(__dirname,'../..'),'res','ln.BMP' )}
try {
    //读取文件
    var rbuf = fs.readFileSync(imageObj.src);
    console.log(imageObj.src );
} catch (err) {
    console.log(err);
}

var p = new FileParser(rbuf)

console.log(p.bmpFile.BITMAPFILEHEADER.bfType)
