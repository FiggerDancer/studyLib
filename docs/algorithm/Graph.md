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

### kruskal 算法 （要求无向图）

最小生成树

以边的角度出发，依次选择最小的边

加上后会形成环，就不要了

实现某种机制，能让集合快速合并和查询

因为每次可能带进来多个点

```js
// 模拟并查集（其实不是，并查集的接口都是常数级的）
class MySets {
    constructor(nodes) {
        this.setMap = new Map()
        this.nodes.forEach((node) => {
            const set = []
            set.push(node)
            setMap.set(node, list)
        })
    }

    isSameSet(from, to) {
        const fromSet = this.setMap.get(from)
        const toSet = this.setMap.get(to)
        return (fromSet === toSet)
    }
    
    union(from, to) {
        const fromSet = this.setMap.get(from)
        const toSet = this.setMap.get(to)
        const unionSet = [...fromSet, ...toSet]
        unionSet.forEach((union) => {
            this.setMap.set(union, unionSet)
        })
    }
}

function kruskalMST(graph) {
    const unionFind = new MySets(graph.nodes)
    const queue = edges.slice().sort((a, b) => {
        a.weight - b.weight
    })
    const result = new Set()
    while (queue.length) {
        const edge = queue.shift()
        if (!unionFind.isSameSet(edge.from, edge.to)) {
            result.add(edge)
            unionFind.union(edge.from, edge.to)
        }
    }
    return result
}
```

### prim 算法 （要求无向图）

最小生成树

随便选择一个点开始，选一条最小边连接的点d

加上后会形成环，就不要了

每次只会带进来一个点

```js
function primMST(graph) {
    const st = new Set()
    const result = new Set()
    const priorityQueue = new PriorityQueue((a, b) => a.weight - b.weight)
    // 这个for循环是考虑森林的情况
    graph.nodes.forEach((node) => {
        node.edges.forEach((edge) => {
            priorityQueue.add(edge)
        })
        while (!priorityQueue.isEmpty()) {
            const edge = priorityQueue.poll()
            const toNode = edge.to
            if (!st.has(toNode)) {
                st.add(toNode)
                result.add(edge)
                toNodes.edges.forEach((nextEdge) => {
                    priorityQueue.add(nextEdge)
                })
            }
        }
    })
    
    return result
}

```

### Dijkstra 迪杰斯特拉 （环的累加和权值不能为负数）

单元最短路径算法

```js
function dijkstra(head) {
    // 从head到达T这个点的距离
    // key:从head出发到key
    // value: 从head出发到达key的最小距离
    // 如果表中无记录，则含义是从head出发到T这个点的距离为正无穷
    const distanceMap = new Map()
    distanceMap.set(head, 0)
    // 已经求过的点，以后再也不碰
    const selectedNodes = new Set()
    const minNode = getMinDistanceAndUnselectedNode(distanceMap, selectedNodes)
    while (!minNode) {
        const distance = distanceMap.get(minNode)
        minNode.edges.forEach((edge) => {
            const toNode = edge.to
            if (!distanceMap.has(toNode)) {
                distanceMap.set(toNode, distance + edge.weight)
            }
            distanceMap.set(edge.to, Math.min(distanceMap.get(toNode), distance + edge.weight))
        })
        selectedNodes.add(minNode)
        minNode = getMinDistanceAndUnselectedNode(distanceMap, selectedNodes)
    }
    return distanceMap;
}

function getMinDistanceAndUnselectedNode(distanceMap, selectedNodes) {
    let minDistance = Number.MAX_SAFE_INTEGER
    let minNode
    for (const [node, distance] of distanceMap.entries()) {
        if (!selectedNodes.has(node) && distance < minDistance) {
            minNode = node
            minDistance = distance
        }
    }
    return minNode
}
```
