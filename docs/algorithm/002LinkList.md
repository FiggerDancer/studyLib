# 链表

## 哈希表

### 哈希表

哈希表在使用的过程中，任何操作，数据量再大，都是常数时间。（注意哈希表的常数时间是比较大的）  
key为基础类型，则所占空间为该key所占的空间（复制一份）  
key为引用类型，则所占空间为8字节（直接记录该引用的内存地址作为key）  
哈希表key是无序的  

### 有序表

红黑树、avl数、size-balance-tree、跳表都可以实现优先表。  
增删改查性能都是 O(logN)
就是key有序的哈希表  
放入有序表的key如果是基础类型，内部按值传递，如果放入的key不是基本类型，必须要提供比较器。  

### 原理

涉及到哈希表原理的的题一定是难题

:::warning
关于链表问题：  

1.对于笔试，不要纠结空间复杂度，一切为了时间复杂度  
2.对于面试，时间复杂度依然放在第一位，但是一定要找到空间最省的方法  

重要技巧:  

1. 哈希表辅助  
2. 快慢指针  
:::

## 课后题

### 判断单链表是否是回文单链表

方法一：栈  
空间复杂度O(1)  

::: normal-demo 方法一：栈  

```js
const isPalindrome = (head) => {
  const stack = []
  const root = head
  while (head) {
    stack.push(top.val)
    head = head.next
  }
  head = root
  while (head) {
    const top = stack.pop()
    if (head.val !== top) return false
    head = head.next
  }
  return true
}
```

:::

方法二：快慢指针+栈  
空间复杂度O(N)  

::: normal-demo 方法二:

```js
const isPalindrome = (head) => {
  const stack = []
  let s = head
  let f = head
  while (s.next && f.next.next) {
    s = s.next
    f = f.next.next
  }
  while (s) {
    stack.push(s.val)
    s = s.next
  }
  let cur = head
  while (stack.length) {
    const top = stack.pop()
    if (top !== cur.val) {
      return false
    }
    cur = cur.next
  }
  return true
}
```

:::

方法三：快慢指针+逆序  
空间复杂度O(1)  

::: normal-demo

```js
const isPalindrome = (head) => {
  let s = head
  let f = head
  while (s.next && f.next.next) {
    s = s.next
    f = f.next.next
  }
  f = s.next
  s.next = null
  let next = null
  while (f) {
    next = f.next
    f.next = s
    s = f
    f = next
  }
  next = s
  f = head
  let res = true
  while (f && s) {
    if (f.val !== s.val) {
      res = false
    }
    f = f.next
    s = s.next
  }
  s = next.next
  next.next = null // 拿来记录上一个点
  while (s) {
    f = s.next
    s.next = next
    next = s
    s = f
  }
  
  return res
}
```

:::

### 单链表区分

利于快速排序思想划片，然后搞6个点，分别表示小于划片点的头部点和尾部点，等于划片点的头部点和尾部点，大于划片点的头部点和尾部点，然后分别去统计。

::: normal-demo

```js
const partition = (head, pivot) => {
  let sH = null
  let sT = null
  let eH = null
  let eT = null
  let bH = null
  let bT = null
  let next
  while (head) {
    next = head.next
    head.next = null
    if (head.val < pivot) {
      if (!sH) {
        sH = head
        sT = head
      } else {
        sT.next = head
        sT = head
      }
    } else if (head.val === pivot) {
      if (!eH) {
        eH = head
        eT = head
      } else {
        eT.next = head
        eT = head
      }
    } else {
      if (!bH) {
        bH = head
        bT = head
      } else {
        bT.next = head
        bT = head
      }
    }
    head = next
  }
  if (sT) {
    sT.next = eH
    eT = eT ? eT : sT
  }
  if (!eT) {
    eT.next = bH
  }
  return sH ? sH : (eH ? eH : bH)
}
```

:::

### 赋值含有随机指针节点的链表 （剑指35）

方法一：哈希表辅助

::: normal-demo

```js
var copyRandomList = function(head) {
    const map = new Map();
    function getNode(node) {
        if (!node) return null;
        const mapNode = map.get(node);
        return mapNode;
    }
    let current = head;
    while (current) {
        const copyNode = new Node(current.val);
        map.set(current, copyNode);
        current = current.next;
    }
    current = head;
    while (current) {
        const currentCopy = getNode(current)
        currentCopy.next = getNode(current.next);
        currentCopy.random = getNode(current.random)
        current = current.next;
    }
    return getNode(head);
};
```

:::

方法二：原地复制

::: normal-demo

```js
const copyNodeList = (head) => {
  let cur = head
  let next = null
  while (cur) {
    next = cur.next
    cur.next = new Node(cur.val)
    cur.next.next = next
    cur = next
  }
  cur = head
  let curCopy = null
  while (cur) {
    next = cur.next.next
    curCopy = cur.next
    curCopy.rand = cur.rand ? cur.rand.next : null
    cur = next
  }
  let res = head.next
  cur = head
  while (cur) {
    next = cur.next.next
    curCopy = cur.next
    cur.next = next
    curCopy.next = next ? next.next : null
    cur = next
  }
  return res
}
```

:::

### 反转单向和双向链表:分别实现反转单向链表和反转双向链表的函数,如果 链表长度为N，时间复杂度要求为0 (N)，额外空间复杂度要求为0(1)

::: normal-demo 反转单向链表

```js
function reverseLinkList(header) {
 let cur = header;
  let next = null;
  let pre = null;
  while (cur) {
   next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}
```

:::

::: normal-demo 反转双向链表

```js
function reverseLinkList(header) {
  let cur = header;
  let next = null;
  let prev = null;
  while (cur) {
    next = cur.next;
    prev = cur.prev;
    cur.next = prev;
    cur.prev = next;
    cur = next;
  }
}
```

:::

### 打印两个有序链表的公共部分，时间复杂度O(N),额外空间复杂度O(1)

::: normal-demo

```js
function publicLinkList(header1, header2) {
  let cur1 = header1;
  let cur2 = header2;
  while (cur1 && cur2) {
    if (cur1.value === cur2.value) {
      console.log(cur1.value)
      cur1 = cur1.next;
      cur2 = cur2.next;
    } else if (cur1.value < cur2.value) {
      cur1 = cur1.next;
    } else {
      cur2 = cur2.next;
  }
}
```

:::

### 两个单链表相交：给定两个可能有环也可能无环的单链表，请实现一个函数，若两个链表相交，返回相交的第一个节点。若不相交，返回null (剑指52)

要求： 如果两个链表长度之和为N，时间复杂度请达到 O(N) 额外空间复杂度请达到 O(1)

第一步 找入环节点

::: normal-demo 哈希表辅助 空间复杂度不满足

```js
function getLoopNode(head) {
    const st = new Set()
    let cur = head
    // 找到入环节点
    while (cur) {
        if (st.has(cur)) {
            return cur
        }
        st.add(cur)
        cur = head.next
    }
    return null
}
```

:::

::: normal-demo 快慢指针

```js
/**
 * 有环的情况下，快指针一定能追上慢指针，且在两圈之内
 * 所以时间复杂度是O(N)
 */
function getLoopNode(head) {
    if (head === null) return null
    let fast = head
    let slow = head
    while (fast !== slow) {
        if (!fast.next || !fast.next.next) return null
        fast = fast.next.next
        slow = slow.next
    }
    // 此时快慢指针相遇
    // 快指针回到开头
    fast = head
    // 接下来快慢指针每次各走一步，一定可以在入环处相遇
    while (fast !== slow) {
        fast = fast.next
        slow = slow.next
    }
    return slow
}

```

:::

第二步

两个无环单链表，一旦走到相交部分，则后面的节点一定共有。所以这种情况两个单链表最后一个节点必定相等。  
长链表想走差值步，后面两人各往后一步一步走，最终定能相遇

::: normal-demo 分不同情况

```js
/**
 * 有环的情况下，快指针一定能追上慢指针，且在两圈之内
 * 所以时间复杂度是O(N)
 */
function getLoopNode(head) {
    if (head === null) return null
    let fast = head
    let slow = head
    while (fast !== slow) {
        if (!fast.next || !fast.next.next) return null
        fast = fast.next.next
        slow = slow.next
    }
    // 此时快慢指针相遇
    // 快指针回到开头
    fast = head
    // 接下来快慢指针每次各走一步，一定可以在入环处相遇
    while (fast !== slow) {
        fast = fast.next
        slow = slow.next
    }
    return slow
}

function getLinkListSize(head, loopNode) {
    if (!head) return 0
    let cur = head;
    let size = 0
    let pre = null
    while (cur) {
        size++
        if (cur === loopNode) {
            return {
                size,
                end: loopNode
            }
        }
        pre = cur
        cur = cur.next
    }
    return {
        size,
        end: pre
    }
}

function noLoop(head1, head2, loopNode1, loopNode2) {
    const { size: size1, end: end1 } = getLinkListSize(head1, loopNode1)
    const { size: size2, end: end2 } = getLinkListSize(head2, loopNode2)
    if (end1 !== end2) return null
    const diff = Math.abs(size1 - size2)
    let long
    let short
    if (size1 > size2) {
        long = head1
        short = head2
    } else {
        long = head2
        short = head1
    }
    for (let i = 0; i < diff; i++) {
        long = long.next
    }
    while (long !== short) {
        long = long.next
        short = short.next
    }
    return long
}

function bothLoop(head1, head2, loopNode1, loopNode2) {
    // 两个链表在入环点入环
    if (loopNode1 === loopNode2) return loopNode1
    const node = noLoop(head1, head2, loopNode1, loopNode2)
    if (node) {
        return node
    }
    // 两个链表在非入环点入环,返回loopNode1 和 loopNode2都行
    let cur = loopNode1
    while (cur !== loopNode2 && cur !== loopNode1) {
        cur = cur.next
    }
    if (cur === loopNode2) {
        return loopNode1
    }
    // 两个链表不相交
    return null
}

function getIntersectNode(head1, head2) {
    const loopNode1 = getLoopNode(head1)
    const loopNode2 = getLoopNode(head2)
    if (!loopNode1 && !loopNode2) {
        // 两个链表都无环
        return noLoop(head1, head2)
    } 
    if (loopNode1 && loopNode2) {
        // 两个链表都有环
        return bothLoop(heap1, head2, loopNode1, loopNode2)
    } 
    // 两个链表一个有环，一个链表无环，这个一定不相交
    return null
}

```

:::
