class Test{
    constructor(ppp){
        this.na = ppp
        this.name()
    }

    name() {
        console.log(this.na)
    }
}

var imageObj = new Image();
imageObj.onload = function () {
    drawImage(this)
}
imageObj.src = '../res/ln.BMP'

console.log(imageObj)