// 用于范围内计算均值
function Iterativethresholdpart(imdata){
    
    // 用于范围内计算均值
    function datamean(data,dmin,dmax){
        let sum = 0;
        let num = 0;

        for(let i =0 ; i < data.length ;++i){
            if(data[i]>dmin && data[i]<=dmax){
                sum += data[i]
                num +=1

            }
            else{
                continue
            }
        }
        // 计算均值

        let mean = sum/num
        return mean
    }

    let T = datamean(imdata,-1,255) //总体均值

    while(true){

        // 迭代阈值分割

        let T1 = datamean(imdata,-1,T)
        let T2 = datamean(imdata,T,255)

        let Tn = (T1 + T2) /2

        if(Math.abs(Tn - T) < 0.5){
            T = Tn 
            console.log('T',T,'Tn',Tn)
            break
        }
        else{
            T = Tn 
            console.log('T',T,'Tn',Tn)
            continue
        }

    }
    
}

function gauss(width,height,mathExpe,variance) {

    var gaussmap = []

    for(let i = 0 ; i < width*height ;++i){
        let A = Math.sqrt((-2)*Math.log(Math.random()))

        let B = 2*Math.PI*Math.random()
    
        let C = A*Math.cos(B) 

        r = mathExpe + C*variance
        gaussmap[i] = Math.round(r)
    }

    return gaussmap
}


a = gauss(10,10,0,2)
console.log(a)
Iterativethresholdpart(a)
