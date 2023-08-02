# 并查集

使isSameSet和union两个api的执行速度变快，链表，union快，但是isSameSet慢，Set中isSameSet快，但是union慢

isSameSet 是否是同一集合
union 将两个集合合并

如何去做呢？
将每个元素进行包装一下，包装完成后，生成哈希表，用来维护，自己对应的包装元素，建立一个父映射表，自己指向自己，一个size表，每个元素初始值为1。当调用isSameSet时，不停的往上找自己的上级元素直至找到最顶级元素，判断两元素是否相同，若相同说明属于同一集合，同时为了防止链路过长，在这个过程中将元素的父元素都指向顶级元素，进行扁平化。当调用union时，将小的集合合并到小的集合，然后修改big的size，并移除小的size

```js
class DisjointSet {
    constructor(list) {
        this.elementMap = new Map()
        // 父元素的集合
        this.fatherMap = new Map()
        // 代表元素所在的集合有几个点
        this.sizeMap = new Map()
        // 初始化时要求用户将样本全给好
        for (let i = 0; i < list.length; i++) {
            const value = list[i]
            const element = {
                value
            }
            this.elementMap.set(value, element)
            this.fatherMap.set(element, element)
            this.sizeMap.set(element, 1)
        }
    }
    findHead(element) {
        const path = []
        while (element !== this.fatherMap.get(element)) {
            path.push(element)
            element = this.fatherMap.get(element)
        }
        while (path.length) {
            this.fatherMap.set(path.pop(), element)
        }
        return element
    }
    union(a, b) {
        if (this.elementMap.has(a) && this.elementMap.has(b)) {
            const aF = this.findHead(this.elementMap.get(a))
            const bF = this.findHead(this.elementMap.get(b))
            if (aF !== bF) {
                const big = this.sizeMap.get(aF) >= this.sizeMap.get(bF) ? aF : bF
                const small = big === aF ? bF : aF;
                this.fatherMap.set(small, big)
                this.sizeMap.set(big, this.sizeMap.get(aF) + this.sizeMap.get(bF))
                this.sizeMap.delete(small)
            }
        }
    }
    isSameSet(a, b) {
        if (this.elementMap.has(a) && this.elementMap.has(b)) {
            return this.findHead(this.elementMap.get(a)) === this.findHead(this.elementMap.get(b))
        }
        return false
    }
}
```

## 岛问题

leetCode 200

【题目】  
一个矩阵中只有0和1两种值，每个位置都可以和自己的上、下、左、右四个位置相连，如果有一片1连在一起，这个部分叫做一个岛，求一个矩阵中有多少个岛?  
【举例】  
001010  
111010  
100100  
000000  
这个矩阵中有三个岛  

通过感染过程来解决问题,当碰到一个1后，将其所有连着的位置全部置为2

时间复杂度为$O(n*m)$

```js
function infect(matrix, i, j, n, m) {
    if (i < 0 || j < 0 || j >= m || i >= n || matrix[i][j] !== 1) return
    matrix[i][j] = 2
    infect(matrix, i + 1, j, n, m)
    infect(matrix, i, j + 1, n, m)
    infect(matrix, i - 1, j, n, m)
    infect(matrix, i, j - 1, n, m)
}

function countIslands(matrix) {
    if (matrix == null || matrix[0] == null) {
        return 0
    }
    let n = matrix.length
    let m = matrix[0].length
    let res = 0
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (matrix[i][j] === 1) {
                res++
                infect(matrix, i, j, n, m)
            }
        }
    }
    return res
}
```

### 【进阶】  

如何设计一个并行算法解决这个问题  
