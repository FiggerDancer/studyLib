# 暴力递归

暴力递归就是尝试

1. 把问题转化为规模缩小了的同类问题的子问题
2. 有明确的不需要继续进行递归的条件(base case)
3. 有当得到了子问题的结果之后的决策过程
4. 不记录每一个子问题的解

这也是动态规划的基础

## 汉诺塔问题

打印n层汉诺塔从最左边移动到最右边的全部过程,最小步数

![汉诺塔移动轨迹](https://cdn.jsdelivr.net/gh/lxy951101/chart-bed/assets20230801210242.png)

```js
const func = (i, start, end, other) => {
    if (i === 1) { // base case
        console.log(`Move ${i} from ${start} to ${end}`)
    } else { // 子问题
        func(i - 1, start, other, end)
        console.log(`Move ${i} from ${start} to ${end}`)
        func(i - 1, other, end, start)
    }
}

const hanoi = (n) => {
    if (n > 0) {
        func(n, "左", "右", "中")
    }
}
```

## 全部子序列

打印一个字符串的全部子序列，包括空字符串

```js
function process(str, i, res) {
    if (i === str.length) {
        printList(res)
        return
    }
    const resKeep = res.slice()
    resKeep.push(str[i])
    process(str, i + 1, resKeep)
    const resNoInclude = res.slice()
    process(str, i + 1, resNoInclude)
}

function printList(res) {
    console.log(res.join(''))
}
function abc(str) {
    const strArr = str.split('')
    process(strArr, 0, [])
}
```

## 打印一个字符串的全部排列

打印一个字符串全部排列，要求不出现重复的排列

```js
function process(strArr, i, res) {
    if (i === strArr.length) {
        res.push(strArr.join(''))
    }
    const visit = {}
    for (let j = i; j < strArr.length; j++) {
        if (!visit[strArr[j]]) {
            visit[strArr[j]] = true
            swap(strArr, i, j)
            process(strArr, i + 1, res)
            swap(strArr, j, i)
        }
    }
}

function swap(list, i, j) {
    [list[i], list[j]] = [list[j], list[i]]
}

function abc(str) {
    const res = []
    const strArr = str.split('')
    process(strArr, 0, res)
    console.log(res)
}
```

## 纸牌游戏

给定一个整型数组arr，代表数值不同的纸牌排成一条线。玩家A和玩家B依次拿走每张纸牌，规定玩家A先拿，玩家B后拿，但是每个玩家每次只能拿走最左或最右的纸牌，玩家A和玩家B都绝顶聪明。请返回最后获胜者的分数。

【举例】

arr=[1,2,100,4]。

开始时，玩家A只能拿走1或4。如果开始时玩家A拿走1，则排列变为[2,100,4]，接下来玩家B可以拿走2或4，然后继续轮到玩家A.. .

如果开始时玩家A拿走4，则排列变为[1,2,100]，接下来玩家B可以拿走1或100，然后继续轮到玩家A...

玩家A作为绝顶聪明的人不会先拿4，因为拿4之后，玩家B将拿走100。所以玩家A会先拿1，让排列变为[2,100,4]，接下来玩家B不管怎么选，100都会被玩家A拿走。玩家A会获胜，分数为101。所以返回101。

arr=[1,100,2]。

开始时，玩家A不管拿1还是2，玩家B作为绝顶聪明的人，都会把100拿走。玩家B会获胜，分数为100。所以返回100。

### 思路

先手完了就是后手了，如果先手总能选出最优选择

```js
function first(arr, l, r) {
    if (l === r) {
        return arr[l]
    }
    // 我决定的，我要拿最多的，对我最有利的
    // 拿完之后我就成后手了
    return Math.max(
        arr[l] + second(arr, l + 1, r),
        arr[r] + second(arr, l, r - 1)
    )
}
function second(arr, l, r) {
    if (l === r) {
        return 0
    }
    // 对方决定的，对方会决定对我最不利的，
    // 我得到的最少，是对方决定的，我自己决定不了，所以是只能拿到最少的
    return Math.min(
        first(arr, l + 1, r),
        first(arr, l, r - 1)
    )
}

function win(arr) {
    if (arr.length === 0) {
        return 0
    }
    return Math.max(first(arr, 0, arr.length - 1), second(arr, 0, arr.length - 1))
}

```

## 逆序栈，不能申请额外数据结构

给你一个栈，请你逆序这个栈，不能申请额外的数据结构，只能使用递归函数。如何实现?

![移除栈底元素](https://cdn.jsdelivr.net/gh/lxy951101/chart-bed/assets20230801224641.png)

```js
function f(stack) {
    const result = stack.pop()
    if (stack.length === 0) {
        return result
    } else {
        const last = f(stack)
        stack.push(result)
        return last
    }
}
function reverse(stack) {
    if (stack.length === 0) {
        return
    }
    const i = f(stack)
    reverse(stack)
    stack.push(i)
}
```

## 字符串转化

规定1和A对应、2和B对应、3和C对应...  
那么一个数字字符串比如"111"，就可以转化为"AAA"、“KA"和"AK"。给定一个只有数字字符组成的字符串str，返回有多少种转化结果。  

```js
function process(strArr, i) {
    if (i === strArr.length) {
        return 1;
    }
    if (strArr[i] === '0') {
        return 0
    }
    if (str[i] === '1') {
        const res = process(strArr, i + 1) // i单独作为一部分，后续有多少种做法
        if (i + 1 < str.length) {
            res += process(str, i + 2) // (i和i+1)作为整体结合，后续有多少种方法
        }
        return res
    }
    if (str[i] === '2') {
        const res = process(strArr, i + 1) // i单独作为一部分，后续有多少种做法
        if (i + 1 < str.length && (str[i + 1] >= '0' && str[i + 1] <= '6')) {
            // (i和i+1)作为单独部分不能超过26，决定是否能有后续的方法
            res += process(str, i + 2) // (i和i+1)作为整体结合，后续有多少种方法
        }
        return res
    }
    // 3-9
    return process(str, i + 1)
}
function str(str) {
    const strArr = str.split('')
    return process(strArr, 0)
}
```

## 背包问题

给定两个长度都为N的数组weights和values，weights[i]和values[i]分别代表i号物品的重量和价值。给定一个正数bag，表示一个载重bag的袋子，你装的物品不能超过这个重量。返回你能装下最多的价值是多少?

```js
// i货物的选择
// 重量不能超过bag
// 之前决定好的重量weight
function process(weights, values, i, weight, bag) {
    console.log(weight, i, values[i], weights[i])
    if (weight > bag) {
        // 因为这个加上就会超重，所以应该排除掉这个，超重了就不能拿
        return -Infinity
    }
    if (i === weights.length) {
        return 0
    }
    return Math.max(
        process(weights, values, i + 1, weight, bag),
        values[i] + process(weights, values, i + 1, weight + weights[i], bag)
    )
}
function maxValue(weights, values, bag) {
    return process(weights, values, 0, 0, bag)
}

```

## N皇后

N皇后问题是指在N*N的棋盘上要摆N个皇后，要求任何两个皇后不同行、不同列,也不在同一条斜线上。  
给定一个整数n，返回n皇后的摆法有多少种。n=1，返回1。  
n=2或3，2皇后和3皇后问题无论怎么摆都不行，返回0。n=8，返回92。

### 时间复杂度

O(n^n)

### 思想

通过深度遍历暴力枚举

### 代码

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

### 位运算常数优化

#### 思想

使用位，0，1表示可以不可以放皇后，用于限制皇后的摆放位置

#### 代码

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
