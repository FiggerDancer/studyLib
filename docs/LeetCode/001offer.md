---

sidebarDepth: 1
---

# 剑指系列

## 剑指 Offer 03 数组中重复的数字

### 题目

找出数组中重复的数字。

在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。

#### 示例

```text
输入：
[2, 3, 1, 0, 2, 5, 3]
输出：2 或 3 
```

#### 限制

2 <= n <= 100000

### 解法

#### 思路

#### 代码

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findRepeatNumber = function(nums) {
    const st = new Set()
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i]
        if (st.has(num)) {
            return num
        }
        st.add(num)
    }
    return void 0
};
```

## 剑指 Offer 07 重建二叉树

### 题目

根据前序遍历和中序遍历的来重建二叉树

### 解法一：递归

#### 思路

1. 先序遍历的第一个点是根节点
2. 中序遍历根节点两边的点是左右子树的根节点，也就是左边是根节点的左子树，右边是根节点的右子树形成递归

#### 代码

::: normal-demo

```js
function TreeNode(val, left = null, right = null) {
    return {
        val,
        left,
        right
    }
}

function __buildTree(preOrder, inOrder, preOrderLeft, preOrderRight, inOrderLeft, inOrderRight, indexMap) {
    if (preOrderLeft > preOrderRight) {
        return null
    }
    // 前序遍历第一个节点为根节点
    const preOrderRoot = preOrderLeft
    // 找中序遍历根节点
    const inOrderRoot = indexMap.get(preOrder[preOrderRoot])
    const root = new TreeNode(preOrder[preOrderRoot])
    const leftSize = inOrderRoot - inOrderLeft
    root.left = __buildTree(preOrder, inOrder, preOrderLeft + 1, preOrderLeft + leftSize, inOrderLeft, inOrderRoot - 1, indexMap)
    root.right = __buildTree(preOrder, inOrder, preOrderLeft + leftSize + 1, preOrderRight, inOrderRoot + 1, inOrderRight, indexMap)
    return root
}

function buildTree(preOrder, inOrder) {
    const n = preOrder.length
    const indexMap = new Map()
    inOrder.forEach((val, index) => {
        indexMap.set(val, index)
    })
    return __buildTree(preOrder, inOrder, 0, n - 1, 0, n - 1, indexMap)
}

```

:::

## 剑指 Offer 09 用两个栈实现队列

### 题目

用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。(若队列中没有元素，deleteHead 操作返回 -1 )

### 解法

#### 代码

```js
var CQueue = function() {
    this.stack1 = []
    this.stack2 = []
};

/** 
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function(value) {
    this.stack1.push(value)
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function() {
    if (!this.stack2.length) {
        while (this.stack1.length) {
            this.stack2.push(this.stack1.pop())
        }
    }
    return this.stack2.pop() ?? -1
};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
```

## 剑指 Offer 10-1 斐波那契数列

### 题目

写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的定义如下：

```text
F(0) = 0,   F(1) = 1
F(N) = F(N - 1) + F(N - 2), 其中 N > 1.
```

斐波那契数列由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

### 解法: 动态规划

```js
var fib = function(n) {
    if (n < 2) {
        return n;
    }
    const MOD = 1000000007
    let pre = 0
    let last = 1
    for (let i = 2; i <= n; i++) {
        const cur = (pre + last) % MOD
        pre = last
        last = cur
    }
    return last
};
```

## 剑指 Offer 10-2 青蛙跳台

### 题目

一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 n 级的台阶总共有多少种跳法。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

### 解法: 动态规划

```js
var numWays = function(n) {
    const MOD = 1000000007
    let pre = 1
    let last = 1
    for (let i = 2; i <= n; i++) {
        const cur = (pre + last) % MOD
        pre = last
        last = cur
    }
    return last
};
```

## 剑指 Offer 11 旋转数组的最小数字

把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。

给你一个可能存在 重复 元素值的数组 numbers ，它原来是一个升序排列的数组，并按上述情形进行了一次旋转。请返回旋转数组的最小元素。例如，数组 `[3,4,5,1,2]` 为 `[1,2,3,4,5]` 的一次旋转，该数组的最小值为 1。  

注意，数组 `[a[0], a[1], a[2], ..., a[n-1]]` 旋转一次 的结果为数组 `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]` 。

### 解法一：遍历

```js
var minArray = function(numbers) {
    let lastNum = numbers[0]
    for (let i = 1; i < numbers.length; i++) {
        const number = numbers[i]
        if (number < lastNum) {
            return number
        }
    }
    return numbers[0]
};
```

### 解法二：二分

```js
var minArray = function(numbers) {
    let low = 0;
    let high = numbers.length - 1
    while (low < high) {
        const mid = low + ((high - low) >> 1)
        const number = numbers[mid]
        if (number < numbers[low]) {
            // 说明在这个区间内 (low, mid]
            low += 1
            high = mid
        } else if (number > numbers[high]) {
            // 说明在这个区间内 (mid, high]
            low = mid + 1
        } else {
            // 
            high--
        }
    }
    return numbers[low]
};
```

## 剑指 Offer 12 矩阵中的路径

### 题目

给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

### 解法：回溯

#### 代码

```js
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {
    const h = board.length, w = board[0].length;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const visited = new Array(h);
    for (let i = 0; i < visited.length; ++i) {
        visited[i] = new Array(w).fill(false);
    }
    const check = (i, j, s, k) => {
        if (board[i][j] != s.charAt(k)) {
            return false;
        } else if (k == s.length - 1) {
            return true;
        }
        visited[i][j] = true;
        let result = false;
        for (const [dx, dy] of directions) {
            let newi = i + dx, newj = j + dy;
            if (newi >= 0 && newi < h && newj >= 0 && newj < w) {
                if (!visited[newi][newj]) {
                    const flag = check(newi, newj, s, k + 1);
                    if (flag) {
                        result = true;
                        break;
                    }
                }
            }
        }
        visited[i][j] = false;
        return result;
    }

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            const flag = check(i, j, word, 0);
            if (flag) {
                return true;
            }
        }
    }
    return false;
};



```

## 剑指 Offer 49 丑数

### 题目

我们把只包含质因子 2、3 和 5 的数称作丑数（Ugly Number）。求按从小到大的顺序的第 n 个丑数。

#### 示例

```text
输入: n = 10
输出: 12
解释: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 是前 10 个丑数。

```

#### 说明  

1 是丑数。
n 不超过1690。

### 解法:动态规划

#### 思路

解题思路:<https://leetcode.cn/problems/chou-shu-lcof/solution/mian-shi-ti-49-chou-shu-dong-tai-gui-hua-qing-xi-t/>

#### 代码

```js
/**
 * @param {number} n
 * @return {number}
 */
var nthUglyNumber = function(n) {
    let a = 0, b = 0, c = 0
    const dp = []
    dp[0] = 1
    for (let i = 1; i < n; i++) {
        const n2 = dp[a] * 2
        const n3 = dp[b] * 3
        const n5 = dp[c] * 5
        dp[i] = Math.min(n2, n3, n5)
        if (dp[i] === n2) a++
        if (dp[i] === n3) b++
        if (dp[i] === n5) c++
    }
    return dp[n - 1]    
};
```
