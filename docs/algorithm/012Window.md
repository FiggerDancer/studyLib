# 滑动窗口和单调栈

## 滑动窗口

R右  
L左  
两者都只往右动  
L不超R  

双端队列，一般放下标，其中的数字一般保持单调性  

比如获得双端队列最大值  

R往右走，往里放数值的时候，就要把小于该数值数都弹出，弹完了再往里落  
L往右走，往里删除数值的时候，就要看头部，头部是就删，不是就不管了

双端队列里维护的信息如果依次过期成为最大值的可能性

为什么可以弹出，因为我的值比你大而且下标比你大，过期比你晚，你再也没机会成为最大值了

![题目](https://cdn.jsdelivr.net/gh/lxy951101/chart-bed/assets20230805114919.png)

```js
function maxValue(nums: number[], size = 3) {
    let l = 0
    let r = 0
    const dequeue: number[] = []
    const maxs: number[] = []
    while (r < nums.length) {
        const cur = nums[r]
        // 一直弹
        while (cur >= nums[dequeue[dequeue.length - 1]]) {
            dequeue.pop()
        }
        dequeue.push(r)
        if (r - l >= size - 1) {
            const deleteNum = nums[l]
            const headIndex = dequeue[0]
            const headValue = nums[headIndex]
            if (headValue === deleteNum) {
                dequeue.shift()
            }
            maxs.push(headValue)
            l++
        }
        r++
    }
    return maxs;
}
```

## 单调栈

谁是左边最近比你大的，谁是右边最近比你大的

与滑动窗口相似，当需要弹出的时候，你其实也就发现谁是左边比你大的和右边比你大的最近的了，左边是你弹出后栈里压的数据，右边是当前准备压入栈的那个

![20230805115557](https://cdn.jsdelivr.net/gh/lxy951101/chart-bed/assets20230805115557.png)

```js
function latestMax(nums: number[]) {
    const stack: number[][] = []
    const res:Array<Array<number|undefined>> = []
    for (let i = 0; i  < nums.length; i++) {
        const cur = nums[i]
        let top: number|undefined = void 0
        if (stack.length) {
            top = nums[stack[stack.length - 1][0]]
            while (stack.length && (top || 0) < cur) {
                const arr = stack.pop() || []
                if (stack.length) {
                    top = nums[stack[stack.length - 1][0]]
                } else {
                    top = void 0
                }
                const lastNum = top
                arr.forEach((index) => {
                    res[index] = [lastNum, cur]
                })
                
            }
        }
        if (top === cur) {
            nums[stack[stack.length - 1].push(i)]
        } else {
            stack.push([i])
        }
    }
    while (stack.length) {
        let top: number|undefined = void 0
        const arr = stack.pop() || []
        if (stack.length) {
            top = nums[stack[stack.length - 1][0]]
        } else {
            top = void 0
        }
        const lastNum = top
        arr.forEach((index) => {
            res[index] = [lastNum, void 0]
        })
    }
    return res
}
```

### 问题

定义：数组中累积和与最小值的乘积，假设叫做指标A。  
给定一个数组，请返回子数组中，指标A最大的值。  

#### 思考

可以利用单调栈，上面学到的单调栈用了最近的较大值，这次我们去找最近的左边的较小值和右边的较小值，然后这个范围其实就是每一个数作为最小值时子数组，然后分别计算这些数组的累计和与最小值的乘积

```ts
function lastestMin(nums: number[]) {
    const stack: number[][] = []
    const res:Array<Array<number|undefined>> = []
    for (let i = 0; i  < nums.length; i++) {
        const cur = nums[i]
        let top = Number.MAX_SAFE_INTEGER
        if (stack.length) {
            top = nums[stack[stack.length - 1][0]]
            while (stack.length && (top) > cur) {
                const arr = stack.pop() || []
                if (stack.length) {
                    top = nums[stack[stack.length - 1][0]]
                } else {
                    top = Number.MAX_SAFE_INTEGER
                }
                const lastArr = stack[stack.length - 1] || []
                const lastIndex = lastArr[lastArr.length - 1]
                arr.forEach((index) => {
                    res[index] = [lastIndex, i]
                })
                
            }
        }
        if (top === cur) {
            nums[stack[stack.length - 1].push(i)]
        } else {
            stack.push([i])
        }
    }
    while (stack.length) {
        const arr = stack.pop() || []
        const lastArr = stack[stack.length - 1] || []
        const lastIndex = lastArr[lastArr.length - 1]
        arr.forEach((index) => {
            res[index] = [lastIndex, void 0]
        })
    }
    return res
}

function sum(nums: number[]) {
    const res = lastestMin(nums)
    const maps = res.map(([num1 = 0, num2 = nums.length], index) => {
        let added = 0
        for (let i = num1; i < num2; i++) {
            added += nums[i]
        }
        return added * nums[index]
    })
    return Math.max(...maps)
}
```
