const { checkPrimeSync } = require('crypto');
const fs = require('fs')
const path = require('path')
const { FileParser } = require(path.join(path.resolve(__dirname, '..'), 'store', 'Fileloader.js'))

// srcstring =  'E:/_todo/dip_expe/yedip/src/test/ln.BMP'
// 
// srcstring = 'E:/_todo/dip_expe/yedip/res/Tmp.bmp'

// srcstring = 'E:/_todo/dip_expe/yedip/res/928.bmp'

// srcstring = 'E:/_todo/dip_expe/yedip/res/chinamap.bmp'
// srcstring = 'E:/_todo/dip_expe/yedip/res/zg.bmp'

// srcstring = 'E:/_todo/dip_expe/yedip/res/256car.bmp'

try {
    //读取文件
    var rbuf = fs.readFileSync(srcstring);
} catch (err) {
    console.log(err);
    // alert("文件读取失败")
    return
}

try {

    var fileparse = new FileParser(rbuf)
    var newfile = fileparse.getFile()
    console.log(newfile)
} catch (err) {

    console.log(err)
}
// console.log(fileparse)