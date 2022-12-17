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

    a = [9, 8, 2, 4, 5,0,1]

    sort(a)

    console.log(a)