# N皇后

N皇后问题是指在N*N的棋盘上要摆N个皇后，要求任何两个皇后不同行、不同列,也不在同一条斜线上。  
给定一个整数n，返回n皇后的摆法有多少种。n=1，返回1。  
n=2或3，2皇后和3皇后问题无论怎么摆都不行，返回0。n=8，返回92。

## 时间复杂度

O(n^n)

## 思想

通过深度遍历暴力枚举

## 代码

```js
function nQueen(n) {
    if (n < 1) {
        return 0
    }
    const record = []
    return process1(0, record, n)
}

/**
 * 潜台词：record[0...i-1] 任何两个皇后都不共行，不共列、不共斜线
 * @param i 第i行
 * @param record[0...i-1] 表示之前的行，放了的皇后位置
 * @param N整体一共多少行
 * @return {number} 合力摆法有多少种
 */
function process1(i, record, n) {
    if (i === n) { // 终止行，说明找到了一种方法
        return 1
    }
    let res = 0
    for (let j = 0; j < n; j++) { // 当前行在i行，尝试i行所有的列 -> j
    // 当前i行的皇后，放在j列，会不会导致冲突
    // 如果是无效
    // 如果不是，认为无效
        if (isValid(record, i, j)) {
            record[i] = j
            res += process1(i + 1, record, n)
        }
    }
    return res
}

function isValid(record, i, j) {
    for (let k = 0; k < i; k++) {
        if (j === record[k] || Math.abs(record[k] - j) === Math.abs(i - k)) return false;
    }
    return true
}
```

## 位运算常数优化

### 思想

使用位，0，1表示可以不可以放皇后，用于限制皇后的摆放位置

### 代码

```js
// 不要超过32位皇后，js位运算不支持，但是不如直接打表，直接写死
function nQueen(n) {
    if (n < 1 || n > 32) {
        return 0
    }
    let limit = n === 32 ? -1 : (1 << n) - 1
    return process(limit, 0, 0, 0)
}

/**
 * @param limit 永远是固定的，就是全部列都禁止了
 * @param colLimit表示之前的行，表示列的限制，00010000 ，1的位置是不可以放的,0位置可以放皇后
 * @param leftDigLimit 表示左斜线的限制
 * @param rightDiaLimit 表示右斜线的限制
 * @return {number} 合力摆法有多少种
 */
function process(limit, colLimit, leftDiaLimit, rightDiaLimit) {
    if (colLimit === limit) { // base case 终结了，填满了
        return 1
    }
    let mostRightOne = 0
    // 得出可以放的位置，此时1可以放
    let pos = limit & (~(colLimit | leftDiaLimit | rightDiaLimit))
    let res = 0
    while (pos !== 0) {
        // 提取出候选皇后位置中最右侧的1，每个皇后试一遍
        mostRightOne = pos & (~pos + 1)
        pos = pos - mostRightOne
        res += process(
            limit, colLimit 
            | mostRightOne, 
            (leftDiaLimit | mostRightOne) << 1,
            (rightDiaLimit | mostRightOne) >>> 1,
        )
    }
    return res
}
```
