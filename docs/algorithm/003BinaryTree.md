# 二叉树

## 课堂

### 递归序

每个节点都会走3遍

```js
function process(node) {
    if (node == null) {
        return 
    }
    // 1 先序
    process(node.left)
    // 2 中序
    process(node.right)
    // 3 后序
}
```

### 先序遍历 (深度遍历)

先序先打印头节点=>左子树所有节点=>右子树所有节点  
也就是递归序第一次来到这个节点时处理

::: normal-demo 递归

```js
function preOrder(tree, list = []) {
    if (tree === null) {
        return
    }
    list.push(tree.val)
    preOrder(tree.left, list)
    preOrder(tree.right, list)
    return list
}
```

:::

::: normal-demo 非递归

```js
function preOrder(tree) {
    const list = []
    const stack = [tree]
    while (stack.length) {
        const top = stack.pop()
        list.push(top.val)
        if (top.right) {
            stack.push(top.right)
        }
        if (top.left) {
            stack.push(top.left)
        }
    }
    return list
}
```

:::

### 中序遍历

中序:左 => 头 => 右
也就是递归序第二次来到这个节点时处理

::: normal-demo 递归

```js
function inOrder(tree, list = []) {
    if (tree === null) {
        return
    }
    inOrder(tree.left, list)
    list.push(tree.val)
    inOrder(tree.right, list)
    return list
}
```

:::

::: normal-demo 非递归

```js
function inOrder(tree) {
    const res = [];
    const stk = [];
    // 找到一颗树，先把它的左节点全都放到栈中去
    while (root || stk.length) {
        while (root) {
            stk.push(root);
            root = root.left;
        }
        // 依次弹出节点
        root = stk.pop();
        res.push(root.val);
        // 对弹出节点的右树重复
        root = root.right;
    }
    return res;
}
```

:::

### 后序遍历

后序:左 => 右 => 头
也就是递归序第三次来到这个节点时处理

::: normal-demo 递归

```js
function postOrder(tree, list = []) {
    if (tree === null) {
        return
    }
    postOrder(tree.left, list)
    postOrder(tree.right, list)
    list.push(tree.val)
    return list
}
```

:::

::: normal-demo 非递归

```js
function postOrder(tree) {
    const res = []
    const stack = []
    let prev
    while (root || stack.length) {
        // 找到一颗树，先把它的左节点全都放到栈中去
        while (root) {
            stack.push(root)
            root = root.left
        }
        // 依次弹出节点
        root = stack.pop()
        // 如果该节点存在右节点，则需要将其有节点放入栈中，重复执行
        if (!root.right || root.right === prev) {
            // 不存在右节点或右节点等于上个节点，
            // 因为从右节点往上走的时候要判断存不存在右节点，
            // 但这里虽然存在，但是已经处理过了
            res.push(root.val)
            prev = root
            root = null
        } else {
            stack.push(root)
            root = root.right
        }
    }
    return res
}
```

:::

### 层序遍历 (剑指104)

::: normal-demo 层序遍历但不分层

```js
function levelOrder(root) {
    const list = []
    const queue = [root]
    while (queue.length) {
        const head = queue.shift()
        list.push(head.val)
        if (head.left) {
            queue.push(head.left)
        }
        if (head.right) {
            queue.push(head.right)
        }
    }
    return list
}
   
```

:::

::: normal-demo 层序遍历并分层

```js
function levelOrder(root) {
    if (!root) return []
    const res = []
    const queue = [root]
    while (queue.length) {
        const currentLevelSize = queue.length
        res.push([])
        const level = res.length - 1
        for (let i = 0; i < currentLevelSize; i++) {
            const head = queue.shift()
            res[level].push(head.val)
            if (head.left) {
                queue.push(head.left)
            }
            if (head.right) {
                queue.push(head.right)
            }
        }
    }
    return res
}
   
```

:::

## 课后题

### 如何完成二叉树的宽度优先遍历 (求一颗二叉树的宽度)

::: normal-demo 用哈希表

```js
function getWidth(root) {
    const queue = [root]
    const levelMap = new Map()
    levelMap.set(root, 1)
    let curLevel = 1
    let curLevelNodeCount = 0
    let max = Number.MIN_SAFE_INTEGER
    while (queue.length) {
        const head = queue.shift()
        let curNodeLevel = levelMap.get(head)
        if (curNodeLevel === curLevel) {
            curLevelNodeCount++
        } else {
            max = Math.max(max, curLevelNodeCount)
            curLevel++
            curLevelNodeCount = 0
        }
        if (head.left) {
            levelMap.set(head.left, curLevel + 1)
            queue.push(head.left)
        }
        if (head.right) {
            levelMap.set(head.right, curLevel + 1)
            queue.push(head.right)
        }
    }
    return max
}
   
```

:::

::: normal-demo 不使用哈希表

```js
function getWidth(root) {
    if (!root) return 0
    const res = []
    const queue = [root]
    let max = -Infinity
    while (queue.length) {
        const currentLevelSize = queue.length
        res.push([])
        const level = res.length - 1
        max = Math.max(max, currentLevelSize)
        for (let i = 0; i < currentLevelSize; i++) {
            const head = queue.shift()
            res[level].push(head.val)
            if (head.left) {
                queue.push(head.left)
            }
            if (head.right) {
                queue.push(head.right)
            }
        }
    }
    return max
}
```

:::

### 如何判断一颗树是否是搜索二叉树

中序遍历时一定是升序的

::: normal-demo 递归

```js
function isBST(root, prev = -Infinity) {
    if (!root) return true
    if (!isBST(root.left, prev)) {
        return false
    }
    if (root.val <= prev) {
        return false
    }
    prev = root.val
    return isBST(root.right, prev)
}
```

:::

::: normal-demo 迭代

```js
function isBinarySearchTree(root) {
    const stack = []
    let prev = -Infinity
    while (root || stack.length) {
        while (root) {
            stack.push(root)
            root = root.left
        }
        const top = stack.pop()
        if (prev >= top.val) {
            return false
        }
        prev = top.val
        if (top.right) {
            root = top.right
        }
    }
    return true
}
```

:::

::: normal-demo 列可能性

```js
function helper(root) {
    if (!root) {
        return {
            isBST: true,
            min: Infinity,
            max: -Infinity,
        }
    }
    const {
        isBST: isLeftBST,
        max,
    } = helper(root.left)
    const {
        isBST: isRightBST,
        min
    } = helper(root.right)
    const newMax = Math.max(max, root.val)
    const newMin = Math.min(min, root.val)
    const isBST = isLeftBST && isRightBST && max < root.val && root.val < min
    return {
        isBST,
        max: newMax,
        min: newMin
    }
}

function isBST(root) {
    if (!root) return true
    return helper(root).isBST
}
```

:::

### 如何判断一颗树是否是完全二叉树

若设二叉树的深度为h，除第 h 层外，其它各层 (1～h-1) 的结点数都达到最大个数，第 h 层所有的结点都连续集中在最左边，这就是完全二叉树。

利用层序遍历

1. 任一节点有右无左 false  
2. 在不违规条件下，如果遇到了第一个左右子节点补全，后续必须都是叶子节点

::: normal-demo CompleteBinaryTree

```js
function isCBT(head) {
    if (!head) return true
    // 是否遇到过左右两孩子不双全的节点
    let leaf = false
    let l = null
    let r = null
    const queue = []
    queue.push(head)
    while (queue.length) {
        head = queue.shift()
        l = head.left
        r = head.right
        if (
            /**
             * 任一节点有右无左
             */
            (l === null && r !== null) 
            /**
             * 不是叶子节点（有孩子）
             */
            || (leaf && (l !== null || r !== null))
            
        ) {
            return false
        }
        if (l !== null) {
            queue.push(l)
        }
        if (r !== null) {
            queue.push(r)
        }
        if (l === null || r === null) {
            // 遇到了第一个左右子节点补全，后续必须都是叶子节点
            leaf = true
        }
    }
    return true
}
```

:::

### 如何判断一棵树是否是满二叉树

::: normal-demo

```js
function helper(root) {
    if (!root) {
        return {
            height: 0,
            nodeCount: 0
        }
    }
    const {
        height: leftHeight,
        nodeCount: leftNodeCount,
    } = helper(root.left)
    const {
        height: rightHeight,
        nodeCount: rightNodeCount,
    } = helper(root.right)
    const height = Math.max(leftHeight, rightHeight) + 1
    const nodeCount = leftNodeCount + rightNodeCount + 1
    return {
        height,
        nodeCount,
    }
}

function isFullBinaryTree(root) {
    const {
        height,
        nodeCount,
    } = helper(root)
    const fullCount = Math.pow(2, height) - 1
    return fullCount === nodeCount
}
```

:::

### 如何判断一棵树是否是平衡二叉树 (力扣110)

对于任何一个子树来说，它的左树和右树的高度差不能超过1

::: normal-demo

```js
function helper(root) {
    if (!root) {
        return {
            isBalanced: true,
            height: 0
        }
    }
    const {
        isBalanced: isLeftBalanced,
        height: leftHeight
    } = helper(root.left)
    const {
        isBalanced: isRightBalanced,
        height: rightHeight
    } = helper(root.right)
    const height = Math.max(leftHeight, rightHeight) + 1
    const isBalanced = isLeftBalanced && isRightBalanced && Math.abs(leftHeight - rightHeight) < 2
    return {
        isBalanced,
        height,
    }
}

function isBalanceBinaryTree(root) {
    if (!root) return true
    return helper(root).isBalanced
}
```

:::

### 给定两个二叉树的节点node1 和 node2，找到他们的最低公共祖先节点 （剑指68）

::: normal-demo 哈希表

```js
function lowestCommonAncestor(root, node1, node2) {
    const parentMap = new Map()
    const stack = [root]
    parentMap.set(root, root)
    while (stack.length) {
        const top = stack.pop()

        if (top.right) {
            parentMap.set(top.right, top)
            stack.push(top.right)
        }
        if (top.left) {
            parentMap.set(top.left, top)
            stack.push(top.left)
        }
    }

    const st1 = new Set()
    st1.add(node1)
    let cur = node1
    while (cur !== parentMap.get(cur)) {
        st1.add(cur)
        cur = parentMap.get(cur)
    }
    st1.add(root)

    cur = node2
    while (cur) {
        if (st1.has(cur)) {
            return cur
        }
        cur = parentMap.get(cur)
    }
    return root
}

```

:::

方法二: 不使用哈希表  

情况分析:  

1. O1是O2的最低公共祖先，获O2是O1的最低公共最先  
2. O1和O2彼此不互为公共祖先，需要向上搜索找到

::: normal-demo 无哈希表

```js
/**
 * 为什么可以这么做，因为有个前提得条件  node1 和 node2 都一定存在于树里
 */
function lowestCommonAncestor(root, node1, node2) {
    /**
     * 如果root为空则说明下方不可能有node2或者node1 直接返回
     * 如果root为node1获node2则直接返回
     */
    if (root === null || root === node1 || root === node2) { // base case
        return root
    }
    
    /**
     * 左树要答案，如果既没有node1又没有node2，则势必返回null，右树同
     * 但是假设其中一树返回空，则说明node1和node2都在同一树中
     * 答案肯定在不空的里
     */
    const left = lowestCommonAncestor(root.left, node1, node2)
    const right = lowestCommonAncestor(root.right, node1, node2)
    // 左右都不为空，此时只有一种可能性，它的下方一定有node1和node2.
    // 而如果它有其他兄弟节点，势必会返回null
    // 层层往上一定会返回它本身，也就是这个最近祖先节点
    if (left !== null && right !== null) {
        return root
    }
    return left !== null ? left : right
}
```

:::

### 在二叉树中找到一个节点的后继节点

后续节点：中序遍历中一个节点的后面的节点  
前驱节点：中序遍历中一个节点的前面的节点  

1. x有右树的时候，它的后继节点是它右树上的最左节点
2. x无右树的时候，往上走一直到这个节点是父亲的左节点时，我们称之为Y，Y的父节点就是后继节点，如果不存在那就是null

::: normal-demo

```js
function getLeftMost(node) {
    if (node === null) {
        return node
    }
    while (node.left !== null) {
        node = node.left
    }
    return node
}
  
function getSuccessorNode(node) {
    if (node === null) {
        return node
    }
    /**
     * 有右子树，它的后继节点是它右树上的最左节点
     */
    if (node.right !== null) {
        return getLeftMost(node.right)
    }
    // 无右子树，往上走一直到这个节点是父亲的左节点时，我们称之为Y，Y的父节点就是后继节点，如果不存在那就是null
    let parent = node.parent
    while (parent !== null && parent.left !== node) { // 当前节点时父亲节点右孩子
        node = parent
        parent = node.parent
    }
    return parent
}
```

:::

### 二叉树的序列化和反序列化

就是内存里的一棵树如何变成字符串形式，又如何从字符串形式变成内存里的树  
如何判断一棵二叉树是不是另一棵二叉树的子树？ 可以字符串匹配了

### 折叠N次，从上到下，打印所有折痕的方向（微软）

可以感觉出来二叉树的感觉，第一次一个凹折痕  
第二次折：上方多一个凹折痕，下方多一个凸折痕  
第三次：上次出现的两条折痕，上下方各出现一条折痕（共4条）上折痕都是凹，下折痕都是凸  

你会发现，总的头节点凹折痕，每一棵左子树都为凹折痕，每一棵右子树都为凸折痕

想要打印所有折痕方向，可以中序遍历（左中右）

::: normal-demo

```js
function print(n, i = 1, down = true) {
    if (i > N) {
        return 
    }
    print(n, i + 1, true)
    console.log(down ? '凹' : '凸')
    print(n, i + 1, false)
}
```

:::

## 树形dp套路

树形dp套路  
树形dp套路使用前提：如果题目求解目标是S规则，则求解流程可以定成以每一个节点为头节点的子树在s规则下的每一个答案，并且最终答案一定在其中  

### 二叉树节点最大距离问题

从二叉树的节点a出发，可以向上或者向下走，但沿途的节点只能经过一次，到达节点b时路径上的节点个数叫作a到b的距离，那么二叉树任何两个节点之间都有距离，求整棵树上的最大距离。

最大距离（整）

1. 头不参与  
    左最大距离-  
    右最大距离-max  
2. 头参与  
    左高+1+右高-  

```ts
type TreeNode = {
    left?: TreeNode
    right?: TreeNode
    value: number
}

function process(node?: TreeNode): {maxDistance: number;height: number;}{
    if (!node) {
        return {
            maxDistance: 0,
            height: 0,
        }
    }
    const leftInfo = process(node.left)
    const rightInfo = process(node.right)
    const p1 = leftInfo.maxDistance
    const p2 = rightInfo.maxDistance
    const p3 = leftInfo.height + 1 + rightInfo.height
    const maxDistance = Math.max(p3, p2, p1)
    const height = Math.max(leftInfo.height, rightInfo.height) + 1
    return {
        maxDistance,
        height,
    }
}
```

### 最大快乐值问题

1. X参与  
    X乐+a整棵树a不来的最大快乐值+b整颗树b不来max+c整颗树c不来  
2. X 不参与  
    max(a整棵树{a来，a不来})+max(b整颗树{b来，b不来})  

```ts
type Employee = {
    happy: number
    nexts: Record<string, Employee>
}

function process(x: Employee) {
    if (Object.keys(x.nexts).length == 0) {
        return {
            lai: x.happy,
            bu: 0,
        }
    }
    let lai = x.happy
    let bu = 0
    Object.keys(x.nexts).forEach((key) => {
        const next = x.nexts[key]
        const nextInfo = process(next)
        lai += nextInfo.bu
        bu += Math.max(nextInfo.lai, nextInfo.bu)
    })
    return {
        lai, 
        bu,
    }
}

function maxHappy(boss: Employee) {
    const headInfo = process(boss)
    return Math.max(headInfo.lai, headInfo.bu)
}
```

## Morris 遍历 (线索二叉树)

一种遍历二叉树的方式，并且时间复杂度O(N)，额外空间复杂度O(1)  
通过利用原树种大量空闲指针的方式，达到节省空间的目的  

### Morris遍历细节

假设来到当前节点cur，开始时cur来到头节点位置  

1. 如果cur没有左孩子，cur向右移动(cur = cur.right)  
2. 如果cur有左孩子，找到左子树上最右的节点mostRight:  
    a.如果mostRight的右指针指向空，让其指向cur，然后cur向左移动(cur = cur.left)  
    b.如果mostRight的右指针指向cur，让其指向null，然后cur向右移动(cur = cur.right)  
3. cur为空时遍历停止  

### Morris遍历实现

```ts
type TreeNode = {
    left?: TreeNode
    right?: TreeNode
    value: number
}

type Options = {
    pre?: (node: TreeNode) => void
    inOrder?: (node: TreeNode) => void
    pos?: (node: TreeNode) => void
}

function linkListReverse(node?: TreeNode) {
    let pre: TreeNode|undefined = void 0
    let next: TreeNode|undefined = void 0
    while (node) {
        next = node.right
        node.right = pre
        pre = node
        node = next
    }
    return pre 
}

function morris(head: TreeNode, options?: Options) {
    if (!head) {
        return
    }
    const {
        pre,
        inOrder,
        pos,
    } = Object.assign({}, options)
    let cur: TreeNode|undefined = head
    let mostRight = null
    while (cur) {
        mostRight = cur.left // mostRight是cur左孩子
        if (mostRight) {
            
            while (mostRight.right && mostRight.right !== cur) {
                mostRight = mostRight.right
            }
            // mostRight变成cur最右节点
            if (!mostRight.right) {
                // 第一次来到cur
                pre && pre(cur)
                mostRight.right = cur
                cur = cur.left
                continue;
            } else {
                // 第二次来到cur，只有有左子树才会来第二次
                // mostRight.right === cur
                inOrder && inOrder(cur)
                mostRight.right = void 0
                if (pos) {
                    // 后序遍历
                    // 第二次来到cur时，逆序左子树的右边界
                    let root = linkListReverse(cur.left)
                    while (root) {
                        pos(root)
                        root = root.right
                    }
                    // 恢复原状
                    root = linkListReverse(root)
                }
            }
        } else {
            pre && pre(cur)
            inOrder && inOrder(cur)
        }
        cur = cur.right
    }
    if (pos) {
        let root = linkListReverse(head)
        while (root) {
            pos(root)
            root = root.right
        }
        // 恢复原状
        root = linkListReverse(root)
    }
}

morris({
    value: 1,
    left: {
        value: 2,
        left: {
            value: 4,
            left: {
                value: 8,
            },
            right: {
                value: 9,
            }
        },
        right: {
            value: 5,
            left: {
                value: 10,
            },
            right: {
                value: 11,
            }
        }
    },
    right: {
        value: 3,
        left: {
            value: 6,
            left: {
                value: 12,
            },
            right: {
                value: 13,
            }
        },
        right: {
            value: 7,
            left: {
                value: 14,
            },
            right: {
                value: 15,
            }
        }
    }
}, { 
    pre: (treeNode) => {
        // console.log(treeNode.value)
    },
    inOrder: (treeNode) => {
        // console.log(treeNode.value)
    },
    pos: (treeNode) => {
        console.log(treeNode.value)
    }
})
```

### 使用Morris判断搜索二叉树

对morris进行了一些改造，让其能够遇到false就中断，其实可以提供一个中断的函数，一调用就中断更合适

```ts
type TreeNode = {
    left?: TreeNode
    right?: TreeNode
    value: number
}

type Options = {
    pre?: (node: TreeNode) => boolean | void
    inOrder?: (node: TreeNode) => boolean | void
    pos?: (node: TreeNode) => boolean | void
}

function linkListReverse(node?: TreeNode) {
    let pre: TreeNode|undefined = void 0
    let next: TreeNode|undefined = void 0
    while (node) {
        next = node.right
        node.right = pre
        pre = node
        node = next
    }
    return pre 
}

function morris(head: TreeNode, options?: Options) {
    if (!head) {
        return
    }
    const {
        pre,
        inOrder,
        pos,
    } = Object.assign({}, options)
    let cur: TreeNode|undefined = head
    let mostRight = null
    while (cur) {
        mostRight = cur.left // mostRight是cur左孩子
        if (mostRight) {
            
            while (mostRight.right && mostRight.right !== cur) {
                mostRight = mostRight.right
            }
            // mostRight变成cur最右节点
            if (!mostRight.right) {
                // 第一次来到cur
                pre && pre(cur)
                mostRight.right = cur
                cur = cur.left
                continue;
            } else {
                // 第二次来到cur，只有有左子树才会来第二次
                // mostRight.right === cur
                const result = inOrder && inOrder(cur)
                if (result === false) return false
                mostRight.right = void 0
                if (pos) {
                    // 后序遍历
                    // 第二次来到cur时，逆序左子树的右边界
                    let root = linkListReverse(cur.left)
                    while (root) {
                        pos(root)
                        root = root.right
                    }
                    // 恢复原状
                    root = linkListReverse(root)
                }
            }
        } else {
            pre && pre(cur)
            const result = inOrder && inOrder(cur)
            if (result === false) {
                return false
            }
        }
        cur = cur.right
    }
    if (pos) {
        let root = linkListReverse(head)
        while (root) {
            pos(root)
            root = root.right
        }
        // 恢复原状
        root = linkListReverse(root)
    }
    return true
}

function isBST(head: TreeNode) {
    if (!head) return true
    let preValue = Number.MIN_SAFE_INTEGER
    const result = morris(head, {
        inOrder(treeNode, abort) {
            if (treeNode.value <= preValue) {
                return false
            }
            preValue = treeNode.value
        }
    })
    return result
}

```

所有关于树的遍历问题morris都是最优解

## 何为具有平衡性的树

## 介绍树的左旋

## 介绍树的右旋
