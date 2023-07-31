# 排序

## 认识时间复杂度

常数时间操作  
一个操作如果和样本数量没有关系，每次都是固定时间内完成的操作，叫做常数操作。  
评价一个算法的好坏，先看时间复杂度指标，然后再分析不同数据样本下的实际运行时间，也就是”常数项时间“  

### 选择排序

时间复杂度：O($n^2$)  
空间复杂度：O(1)  
稳定性：不稳定  
思路：每次找出最小值放到前面  
遍历每个位置，从每个位置后开始遍历数组每个数，找出一个最小的数，与当前位置的值进行交换  
代码：  
  
```js
const selectionSort = (arr) => {
  for (let i = 0, l = arr.length; i < l; i++) {
    let temp = i
    for (let j = i + 1; j < l; j++) {
      if (arr[temp] > arr[j]) {
        temp = j
      }
    }
    [arr[i], arr[temp]] = [arr[temp], arr[i]]
  }
  return arr
}
```

### 冒泡排序

时间复杂度：O($n^2$)  
空间复杂度：O(1)  
稳定排序  
思路：每次找到最大值放到后面  
决定n个数的位置可以知道是n-1次，且每次能够确定最后一个值的位置。然后每次从开头开始进行比较，将大的往后放  

```js
const bubbleSort = (arr) => {
  for (let n = arr.length - 1; n > 0; n--) {
    for (let i = 0; i < n; i++) {
      const j = i + 1
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
  return arr
}
```

### 异或运算

### 插入排序

时间复杂度：O($n^2$)  
空间复杂度：O(1)  
思路：其实对数组进行分隔性的处理，我先处理数组的前半段保证其顺序一致，再逐渐增加要保持顺序的长度  
先保证0-1  
再保证0-2  
0-3  
这样我再比较的时候，从后往前只要不能交换说明前面都不能交换了  直接就可以结束本次循环了  

```js
const insertSort = (arr) => {
  for (let i = 1, l = arr.length; i < l; i++) {
    for (let j = i; j > 0 && (arr[j] < arr[j - 1]); j--) {
        [arr[j], arr[j - 1]] = [arr[j- 1], arr[j]]
    }
  }
  return arr
}
```

### 二分查找

时间复杂度：O($log_2{n}$)  
空间复杂度：O(1)  
思路：通过不断缩小查找结果所在的范围来确定某个值  

#### 二分查找应用

##### 有序数组返回值的索引

```js
const binarySearch = (arr, value) => {
  let l = 0
  let r = arr.length - 1
  while (l < r) {
    const mid = l + ((r - l) >> 1)
    if (arr[mid] === value) {
      return mid
    } else if (arr[mid] < value) {
      l = mid + 1
    } else {
      r = mid - 1
    }
  }
  return -1
}
```

##### 有序数组中，找>=某个数最左侧的位置

使用一个数来存取相等时候的值

```js
const binarySearch = (arr, value) => {
  let l = 0
  let r = arr.length - 1
  let res
  while (l < r) {
    const mid = l + ((r - l) >> 1)
    if (arr[mid] > value) {
      r = mid - 1
    } else {
      res = mid
      l = mid + 1
    }
  }
  return res
}
```

##### 无序数组判断局部最小（任意两个数不相等）

数组肯定是有最小值的，所以可以假定M是最小值，从中间取，中间如果比两边都小，那么它本身就是局部最小值，否则话可以假定0-M或者M-end之间一定存在一个局部最小值

```js
const findLocalMin = (arr) => {
  let l = 0;
  let r = arr.length - 1
  while (l < r) {
    const mid = l + ((r - l) >> 1)
    if (arr[mid] > arr[mid - 1]) {
      r = mid - 1
    } else if (arr[mid] > arr[mid + 1]) {
      l = mid + 1
    } else {
      return mid
    }
  }
  return l
}
```

### 对数器

#### 概念和使用

1. 有一个你想要测的方法a  
2. 有一个方法b也能解决这个办法，可能时间复杂度比较高，或者是官方的  
3. 你是否每次测问题，是不是依赖于线上Online Judge  
4. 你可以使用a方法解一遍，b方法解一遍，比较结果  

#### 生成一个随机数组

```js
const generateRandomArray = (maxSize, maxValue) => {
  const length = Math.floor((maxSize + 1) * Math.random())
  const arr = new Array(length)
  for (let i = 0, l = arr.length; i < l; i++) {
    arr[i] = Math.floor((maxValue + 1) * Math.random()) - Math.floor(maxValue * Math.random())
  }
  return arr
}
```

## 认识O(nlogn)的排序

### 剖析递归行为和递归行为时间复杂度估算

#### 用递归方法找一个数组中的最大值，系统上到底是怎么做的

示例:`arr[l...R]`范围上求最大值

```js
const process = （arr, l, r) => {
  if (l === r) {
    return arr[l]
  }
  let mid = l + ((r - l) >> 1)
  let leftMax = process(arr, l, mid)
  let rightMax = process(arr, mid + 1, r)
  return Math.max(leftMax, rightMax)
}
```

#### master公式

子问题等规模，都可以用master公式求解时间复杂度  
$T(N) =  aT(\frac{N}{b}) + O(N^d)$  
母问题的数据规模是 N  
子问题的数据规模是 $\frac{N}{b}$  
所以以上题来看  
a调了2次，$\frac{N}{2}$子问题规模  
$T(N) = 2 *T(\frac{N}{2}) + O(1)$
如果$log_b{a} < d$则 $O(N^d)$  
如果$log_b{a} > d$则 $O(N^{log_b{a}})$  
如果$log_b{a} = d$则 $O(N^d* logN)$  
上述公式 a = 2, b=2,d=0，所以得出时间复杂度为O(1)  

### 归并排序

时间复杂度：O($nlogn$)  
公式是$T(N) = 2 *T(\frac{N}{2}) + O(1)$ => $T(N) = 2* T(\frac{N}{2}) + O(1)$
空间复杂度：O(n)  
稳定排序  
思路：其实对数组分割，直至分到1个元素是一份，这时候进行合并操作，每次合并都是一个O($\frac{n}{b}$),最后合并成一个大的  

具体：  

1. 先找中点，切分  
2. 对切分后两边的数组分别排序  
3. 合并，创建临时数组，双指针，先比较，小的放入数组，直至其中一个数组越界，剩下的元素依次放入  
4. 将临时数组的值放回原数组  

```js
const mergeSort = (arr) => {
  process(arr, 0, arr.length - 1)
  return arr
}
  
const merge = (arr, l, mid, r) => {
  const help = []
  let i = 0
  let p1 = l
  let p2 = mid + 1
  while (p1 <= mid && p2 <= r) {
    help[i++] = arr[p1] <= arr[p2] ? arr[p1++] : arr[p2++]
  }
  while (p1 <= mid) {
    help[i++] = arr[p1++]
  }
  while (p2 <= r) {
    help[i++] = arr[p2++]
  }
  const len = help.length
  for (i = 0; i < len; i++) {
    arr[i + l] = help[i]
  }
}
  
const process = (arr, l, r) =>  {
  if (l === r) return
  const mid = l + ((r - l) >> 1)
  process(arr, l, mid)
  process(arr, mid + 1, r)
  merge(arr, l, mid, r)
}
```

#### 应用

##### 小和问题

问题：在一个数组中，每一个数左边比当前数小的数累加起来，叫做这个数组的小和。求一个数组的小和。  
思路：利用归并的思想，左右比较的规则来求小和，当放入左组的数放入临时数组时，将放入的数乘以右组当前个数，就能得出当前这块区间数组的小和，通过递归的方式就可以得出整个数组的小和。  

```js
const smallSum = (arr) => {
  if (arr.length < 2) {
    return 0
  }
  return process(arr, 0, arr.length - 1)
}
  
const merge = (arr, l, mid, r) => {
  const help = []
  let i = 0
  let p1 = l
  let p2 = mid + 1
  let count = 0
  while (p1 <= mid && p2 <= r) {
    if (arr[p1] < arr[p2]) {
      help[i++] = arr[p1++]
      count += (r - p2 + 1) * arr[p1] // （r - p2 + 1)是右组当前个数
    } else {
      help[i++] = arr[p2++]
    }
  }
  while (p1 <= mid) {
    help[i++] = arr[p1++]
  }
  while (p2 <= r) {
    help[i++] = arr[p2++]
  }
  const len = help.length
  for (i = 0; i < len; i++) {
    arr[i + l] = help[i]
  }
  return count
}
  
const process = (arr, l, r) =>  {
  if (l === r) return 0
  const mid = l + ((r - l) >> 1)
  return 
    process(arr, l, mid) +
    process(arr, mid + 1, r) +
    merge(arr, l, mid, r)
}
```

##### 逆序对

```js
const reverseCouple = (arr) => {
  if (arr.length < 2) {
    return 0
  }
  return process(arr, 0, arr.length - 1)
}
  
const merge = (arr, l, mid, r, res) => {
  const help = []
  let i = 0
  let p1 = l
  let p2 = mid + 1
  while (p1 <= mid && p2 <= r) {
    if (arr[p1] <= arr[p2]) {
      help[i++] = arr[p1++]
       
    } else {
      let cur = p1
      while (cur <= mid) {
        res.push([arr[cur++], arr[p2]])
      }
      help[i++] = arr[p2++]
    }
  }
  while (p1 <= mid) {
    help[i++] = arr[p1++]
  }
  while (p2 <= r) {
    help[i++] = arr[p2++]
  }
  const len = help.length
  for (i = 0; i < len; i++) {
    arr[i + l] = help[i]
  }
  return res
}
  
const process = (arr, l, r, res = []) =>  {
  if (l === r) return 0
  const mid = l + ((r - l) >> 1)
  process(arr, l, mid, res)
  process(arr, mid + 1, r, res)
  merge(arr, l, mid, r, res)
  return res
}
```

### 快速排序

#### 引导

##### 问题1

问题：给定一个数组arr，和一个数num，请把小于等于num的数放在数组左边，大于num的数放在数组的右边。要求额外的空间复杂度O(1),时间复杂度(N)  
思路:双指针，小于等于区指针  
不稳定排序  

1. [i]<=num，[i]和<=区的下一个数交换，<=区右扩，i++  
2. [i]>num, i++  

```js
const resolve = (nums, target) => {
  let i = 0, j = 0, len = nums.length
  while (i < len) {
    if (nums[i] <= target) {
      [nums[i], nums[j]] = [nums[j], nums[i]]
      j++
    }
    i++
  }
  return nums
}
```

##### 问题2：荷兰国旗问题

给定一个数组arr，和一个数num，请把小于num的数放在数组的左边，等于num的数放在数组中间，大于num的数放在数组右边。要求额外的空间复杂度O(1),时间复杂度(N)  
思路:三指针，小于区指针，大于区指针  

1. [i]<=num，[i]和<区的下一个数交换，<区右扩，i++  
2. [i] === num,i++  
3. [i]>num, [i]和>区前一个交换，>区左扩，  

```js
const resolve = (nums, target) => {
  let i = 0, l = 0, len = nums.length, r = len - 1
  while (i < r) {
    if (nums[i] < target) {
      [nums[i], nums[l]] = [nums[l], nums[i]]
      l++
    } else if (nums[i] > target) {
      [nums[i], nums[r]] = [nums[r], nums[i]]
      r--
    }
    i++
  }
  return nums
}
```

#### 实现

时间复杂度:O(n)  
空间复杂度:O(log2n) 需要开辟的空间是中点位置  
思路：先对大范围按照国旗问题进行大小区域的划分，然后对小区域、大区域分别进行划分，越分越小。  
为什么要取随机值，这个数学证明的，取一个随机值可以保证为O(nlogn)算法，否则是一个O(n^2)算法  

```js
const quickSort = (arr, l = 0, r = arr.length - 1) => {
  if (arr.length < 2) return
  if (l < r) {
    const random = Math.floor((r - l + 1) * Math.random())
    const target = arr[random]
    const [_l, _r] = partition(arr, target, l, r)
    quickSort(arr, l, _l - 1)
    quickSort(arr, _r + 1, r)
  }
  return arr
}


const partition = (nums, target, _l, _r) => {
  let i = 0, l = _l, r = _r
  while (i < r) {
    if (nums[i] < target) {
      [nums[i], nums[l]] = [nums[l], nums[i]]
      l++
    } else if (nums[i] > target) {
      [nums[i], nums[r]] = [nums[r], nums[i]]
      r--
    }
    i++
  }
  console.log(l, r)
  return [l, r]
}
```

## 桶排序以及排序总结

### e堆

堆就是一个完全二叉树  
大根堆：子树最大值就是头节点的值  
小根堆：子树最小值就是头节点的值  

### 堆排序

时间复杂度：O(logN)  
空间复杂度：O(1)  
不稳定排序  
思路：利用完全二叉树的特性，先生成一个大根堆，然后再将大根堆里的最大数取出放到数组最后，减小堆容量，重复操作，这样就完成排序。  

```js
const heapInsert = (arr, index) => {
    while (arr[index] > arr[index - 1 >> 1]) {
        swap(arr, index, (index - 1 >> 1))
        index = (index - 1) >> 1
    }
}

function heapify(arr, index, heapSize) {
    let left = index * 2 + 1
    while (left < heapSize) {
        // 两个孩子中，谁的值最大，把下标给largest
        let largest = left + 1 < heapSize  && arr[left + 1] > arr[left] ? left + 1 : left
        // 父和较大的孩子之间，谁的值更大，使用它的索引
        largest = arr[largest] > arr[index] ? largest : index
        // 说明不需要变
        if (largest === index) {
            break;
        }
        swap(arr, largest, index)
        index = largest
        left = index * 2 + 1
    }
}

const heapSort = (arr) => {
    if (arr == null || arr.length < 2) {
        return
    }
    // 这一块整体是O(NlogN)
    // for (let i = 0, l = arr.length; i < l; i++) { 
       // heapInsert(arr, i) // OlogN
    // }
  
    // 这个方法相对上面方法更快，也能生成大根堆,O(N)
    for (let i = arr.length - 1; i >=0; i--) {
      heapify(arr, 0, arr.length)
    }
  
    let heapSize = arr.length
    swap(arr, 0, --heapSize)
    while (heapSize > 0) {
        heapify(arr, 0, heapSize) // OlogN
        swap(arr, 0, --heapSize) // O1
    }
    return arr
}


```

### 小根堆

优先级队列底层就是堆，默认就是小根堆

#### 应用

##### 问题1

问题：已知一个几乎有序的数组，里面的元素移动距离不超过k  
时间复杂度： O(N * logK)  
空间复杂度: O(K)  给优先级队列  
思想： 放k+1个数是因为数组中最小的数，最多就是跑到k位置上，不可能再往后排了，所以我们可以直接从这里面取出最小的数，直接就可以放到数组的第一位  

```js
const sort = (arr, k) => {
  const heap = new PriorityQueue() // 小根堆
  const min = Math.min(arr.length - 1, k)
  // 先加k+1个数
  for (let i = 0; i <= min; i++) {
    heap.add(arr[i])
  }
  // 放k+1个数是因为数组中最小的数，最多就是跑到k位置上，不可能再往后排了，所以我们可以直接从这里面取出最小的数，直接就可以放到数组的第一位
  let i = 0
  
  for (;index < arr.length; i++, index++) {
    heap.add(arr[index])
    arr[i] = heap.poll()
  }
  while (!heap.isEmpty()) {
    arr[i++] = heap.poll()
  }
}
```

##### 问题2

一个数据流中，随时可以取得中位数

###### 思路

1. cur >= 大根堆堆顶
2. 是入大根堆，否入小根堆
3. 看大小，size较大且到达2，size较小，大的堆弹出进小的堆

```js
function getPos(arr) {
  const pQ = new PriorityQueue()
  const maxPQ = new PriorityQueue((a, b) => b - a)
  for (let i = 0; i < arr.length; i++) {
    const cur = arr[i]
    const top = maxPQ.front()
    if (cur >= top) {
      maxPQ.add(cur)
      const size = maxPQ.size()
      const minSize = pQ.size()
      if (size - minSize >= 2) {
        pQ.add(maxPQ.poll())
      }
    } else {
      pQ.add(cur)
      const size = maxPQ.size()
      const minSize = pQ.size()
      if (minSize - size >= 2) {
        maxPQ.add(pQ.poll())
      }
    }
  }
  const top = maxPQ.front()
  const minTop = pQ.front()
  const size = maxPQ.size()
  const minSize = pQ.size()
  if (size === minSize) {
    return (top + minTop) / 2
  } else if (size > minSize) {
    return top
  }
  return minTop
}
```

### 比较器

### 桶排序

稳定排序

### 计数排序

之前的排序算法都是比较排序，都是数据之间两两比较，计数排序则需要根据数据范围，有特定的条件，适应范围较窄

### 基数排序

思想：按照10进制来处理，先处理低位，后处理高位，这样保证高位优先

```js
/*
* @params digit 最大值有多少10进制数，多少位 
*/
const radixSort = (arr, l, r, digit) => {
  const radix = 10
  let i = 0, j = 0
  // 定义桶的空间
  const bucket = []
  // 先处理低位在处理高位，这样就可以高位优先级高
  for (let d = 1; d <= digit; d++) { // 有多少位就进多少次O(K)
    // 定义数字的空间
    // count[0] 当前位（d)是0的数字有多少个
    // count[1] ..........0、1数字有多少个
    // count[i] 当前位（d)是0 ~ i的数字有多少个
    const count = []
    for (i = l; i <= r; i++) {
      j = getDigit(arr[i], d);
      count[j]++;
    }
    // count统计的是每个数字 <= i的个数
    for (let i = 1; i < radix; i++) {
      count[i] = count[i] + count[i - 1]
    }
    // 为什么要从右往左，因为利用count,确定数字所在的位置
    for (let i = r; i >= l; i--) {
      j = getDigit(arr[i], d)
      bucket[count[j] - 1] = arr[i]
      count[j]--
    }
    // 修改原数组
    for (i = l, j = 0; i < r; i++, j++) {
      arr[i] = bucket[j]
    }
  }
}

const getDigit = (num, d) => {
  const x = 10 ** (d - 1)
  const t = Math.floor(num / x)
  return t % 10
}
```

### 各种排序的比较

|时间复杂度|空间复杂度|稳定性|
|---|---|---|
|n^2|1|2|
|n^2|1|1|
|n^2|1|1|
|n*logn|n|1|
|n*logn|logn|2|
|n*logn|1|2|

时间复杂度 n*logn这个指标已经是极限了  
时间复杂度n*logn，空间复杂度n且稳定不行  

### 常见的坑

归并排序额外空间复杂度可以变为1，但是非常难，而且会丧失稳定性，不如用堆（归并排序 内部缓存法）  
原地归并排序的帖子都是垃圾，会让归并排序时间复杂度变为n^2,不如用插入  
快速排序做到稳定性，空间复杂度会变为n，不如用归并  

有一道题目，是奇数放在数组左边，偶数放在数组右边，还要求原始的相对次序不变，碰到这个问题，可以怼面试官。（若要求空间复杂度n，则需要用01标准的sortable，难度是论文级别的）  

### 综合排序

在大样本时使用快速排序，在小样本时使用插入排序，这是因为插入排序小样本情况下常数时间低。  
在排序的元素为基础类型时，会使用快速排序，不在意稳定性，在排序的元素为非基础类型时，会使用归并排序，因为计算机并不清楚你是否需要稳定性，快速排序经过实验，时间上要比归并排序快。  
