let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]

function sort(arr) {
    for (var j = 0; j < arr.length - 1; j++) {
        for (var i = 0; i < arr.length - 1; i++) {
            // 如果前一个数 大于 后一个数 就交换两数位置
            if (arr[i] > arr[i + 1]) {
                var temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
            }
        }
    }
}
for (let i = 1; i < 5; i += 3) {
    for (let j = 1; j < 5; j += 3) {
        var newdata = arr[(j - 1) * 6 + (i - 1)] * 1 + arr[(j - 1) * 6 + i] * 2 +
            arr[(j - 1) * 6 + (i + 1)] * 1 + arr[j * 6 + (i - 1)] * 0
            + arr[j * 6 + i] * 0 + arr[j * 6 + i + 1] * 0 + arr[(j + 1) * 6 + (i - 1)] * (-1)
            + arr[(j + 1) * 6 + i] * (-2) + arr[(j + 1) * 6 + i + 1] * (-1)

        arr[j * 6 + i] = newdata
    }
}

console.log(arr)