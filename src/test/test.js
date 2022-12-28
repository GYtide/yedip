class History{

    constructor(maxl){
        this.history = new Array();
        this.nowimg = -1;
        this.length = 0;
        this.maxl = maxl
    }

    pop(){
        // 删除最后
        this.history.pop()

        if(this.nowimg == this.length){
            this.length -=1
            this.nowimg -=1
        }
        else{
            this.length -=1
        }
   

    }

    shift(){
        // 删除最前
        this.history.shift()
        this.length -=1
        this.nowimg -=1
    }

    push(element){
        while(true){
            if(this.nowimg == this.length -1){
                break
            }
            else{
                this.pop()
            }
        }
        if(this.length >= this.maxl){
            this.shift()
        }
        this.history.push(element)
        this.length +=1
        this.nowimg +=1
        
    }

    undo(){
        // 将 nowimg 向前移动
        if(this.nowimg > 0 ){
            this.nowimg -= 1
            return this.history[this.nowimg]
        }
        else{
            return null;
        }
    }
    
    redo(){
        // 将 nowimg 向后移动
        if(this.nowimg  < this.length -1 ){
            this.nowimg += 1
            return this.history[this.nowimg]
        }
        else{

            return null
        }
    }
}

var historyimg = new History(5)



historyimg.push([1])
historyimg.push([2])
historyimg.push([3])
historyimg.push([4])
historyimg.push([5])
console.log(historyimg)
historyimg.push([6])
historyimg.push([7])
console.log(historyimg)

// historyimg.shift()


historyimg.undo()

historyimg.undo()
historyimg.undo()



console.log(historyimg)

historyimg.push([8])

console.log(historyimg)

historyimg.push([9])
historyimg.push([10])

console.log(historyimg)
console.log(historyimg.undo())

historyimg.undo()
console.log(historyimg)

historyimg.redo()
historyimg.redo()
console.log(historyimg)
historyimg.redo()
historyimg.redo()
console.log(historyimg)


