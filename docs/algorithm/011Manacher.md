# Manacher算法

## 经典解法

通过加一个特殊字符，然后对一个数字记录以其为中心的回文子串

时间复杂度 $O(n^{2})$

![Manacher经典解法](https://cdn.jsdelivr.net/gh/lxy951101/chart-bed/assets20230805095338.png)

## 加速算法

回文直径 L - R  
回文半径 C - R  
回文最左 L = 0  
回文最右 R = 8  
回文中心 C = 4  

1. 情况1：i在LR外部，暴力扩  
2. 情况2：i在LR内部，一定存在$i^{'}$与其对称  
![对称点](https://cdn.jsdelivr.net/gh/lxy951101/chart-bed/assets20230805101357.png)
    1. i的回文直径在LR内部，则i'回文半径也在LR内部
    ![i的回文在LR内部](https://cdn.jsdelivr.net/gh/lxy951101/chart-bed/assets20230805102635.png)
    2. i的回文区域在LR外部
    3. i的回文区域压线

对应的伪代码:

![伪代码](https://cdn.jsdelivr.net/gh/lxy951101/chart-bed/assets20230805104116.png)

```ts
function manacher(s: string) {
    const transformedStr = s.replaceAll('', '#')
    const str = transformedStr.split('')
    const pArr: number[] = [] // 回文半径数组
    let c = -1
    let r = -1
    let max = Number.MIN_SAFE_INTEGER
    for (let i = 0; i !== str.length; i++) {
        // 每个位置求回文半径
        // i至少得回文区域，先给pArr[i]
        pArr[i] = r > i ? Math.min(pArr[2 * c - i], r - i) : 1
        while (i + pArr[i] < str.length && i - pArr[i] > -1) {
            if (str[i + pArr[i]] === str[i - pArr[i]]) {
                pArr[i]++
            } else {
                break;
            }
        }
        if (i + pArr[i] > r) {
            r = i + pArr[i]
            c = i
        }
        max = Math.max(max, pArr[i])
    }
    return max - 1
}
```
