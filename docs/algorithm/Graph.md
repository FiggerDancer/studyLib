# 图

## 基本知识

点和线的集合

### 图所涵盖的类型

```ts
/**
 * 边
 */
interface Edge {
    /**
     * 权重
     */ 
    weight: number
    from: Point
    to: Point
}

/**
 * 点
 */
interface Point {
    value: number
    /**
     * 出度
     */
    out: number
    /**
     * 入度
     */
    in: number
    /**
     * 从自己出发相邻的点
     */
    nexts: Point[]
    /**
     * 自己的边
     */
    edges: Edge[]
}

/**
 * 图
 */
interface Graph {
    /**
     * 点
     */
    nodes: Map<number, Node>
    /**
     * 边
     */
    edges: Edge[]
}
```

### 矩阵表示图

```js
const matrix = [
    [
        // from
        0,
        // to
        1, 
        // 权重
        3,
    ],
    [
        // from
        1,
        // to
        2, 
        // 权重
        5,
    ],
    [
        // from
        2,
        // to
        0, 
        // 权重
        7,
    ]
]
```

### 创建图

::: normal-demo

```js
class Node {
    constructor(value) {
        this.value = value
        this.out = 0
        this.in = 0
        this.nexts = []
        this.edges = []
    }
}
class Edge {
    constructor(option) {
        const {
            weight, from, to
        } = option
        this.weight = weight
        this.from = from 
        this.to = to
    }
}

class Graph {
    constructor() {
        this.nodes = new Map()
        this.edges = new Set()
    }
}

function createGraph(matrix) {
    const graph = new Graph()
    for (let i = 0; i < matrix.length; i++) {
        const [from, to, weight] = matrix[i]
        if (!graph.nodes.has(from)) {
            graph.nodes.set(from, new Node(from))
        }
        if (!graph.nodes.has(to)) {
            graph.nodes.set(to, new Node(to))
        }
        const fromNode = graph.nodes.get(from)
        const toNode = graph.nodes.get(to)
        const edge = new Edge({
            weight,
            from: fromNode,
            to: toNode,
        })
        fromNode.nexts.push(toNode)
        fromNode.out++
        toNode.in++
        fromNode.edges.push(edge)
        graph.edges.add(edge)
    }
}
```

:::

## 课后题

### 图的宽度/广度优先遍历

1. 利用队列实现
2. 从源节点开始依次按照宽度进队列，然后弹出
3. 每弹出一个点，把该节点所有没有进过队列的邻接点放入队列
4. 直到队列变空

::: normal-demo

```js
function bfs(node) {
    if (node == null) {
        return
    }
    const queue = []
    const st = new Set()
    queue.push(node)
    st.push(node)
    while (queue.length) {
        const cur = queue.shift()
        for (let i = 0; i < cur.nexts.length; i++) {
            const next = cur.nexts[i]
            if (!st.has(next)) {
                st.add(next)
                queue.push(next)
            }
        }
    }

}
```

:::

### 图的深度优先遍历

1. 利用栈实现
2. 从源节点开始把节点按照深度放入栈，然后弹出
3. 每弹出一个点，把该节点下一个没有进过栈的邻接点放入栈
4. 直到栈变空

::: normal-demo

```js
function dfs(node) {
    if (node == null) {
        return 
    }
    const stack = []
    const st = new Set()
    stack.push(node)
    st.push(node)
    while (stack.length) {
        const top = stack.pop()
        for (let i = 0; i < top.nexts.length; i++) {
            const next = top.nexts[i]
            if (!st.has(next)) {
                st.add(next)
                stack.push(top)
                stack.push(next)
                break;
            }
        }
    }
}
```

:::

### 拓扑排序

有向图  
常用来做依赖的编译排序  

1. 确定入度为0的点  
2. 将入度为0的点及其影响擦掉  
3. 重复1,2  

::: normal-demo

```js
function sortedTopology(graph) {
    // key: 某一个node
    // value: 剩余的入度
    const inMap = new Map()
    // 入度为0的点，才能进这个队列
    const zeroInQueue = []
    for (let i = 0; i < graph.nodes.length; i++) {
        const node = graph.nodes[i]
        inMap.set(node, node.in)
        if (node.in === 0) {
            zeroInQueue.push(node)
        }
    }
    // 拓扑排序的结果，依次加入result
    const result = []
    while (zeroInQueue.length) {
        const cur = zeroInQueue.shift()
        result.push(cur)
        for (let i = 0; i < cur.nexts.length; i++) {
            const next = cur.nexts[i]
            inMap.set(next, inMap.get(next) - 1)
            if (inMap.get(next) === 0) {
                zeroInQueue.push(next)
            }
        }
    }
    return result
}
```

:::

###
