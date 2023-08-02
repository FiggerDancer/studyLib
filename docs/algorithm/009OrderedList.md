# 有序表

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
