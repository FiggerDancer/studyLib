function getNextArray(str: string) {
    if (str.length === 1) {
        return [-1]
    }
    const next:number[] = [-1, 0]
    let i = 2;
    let cn = 0;
    while (i < str.length) {
        if (str[i - 1] === str[cn]) {
            next[i++] = ++cn
        }
        // 当前调到cn位置的字符，和i-1位置的字符配不上
        // cn其实此时是配不上的那个位置，、
        // 在next这个位置同时记录了这个位置的相同前缀字符串个数
        // 理解难度大（然后这个前缀其实跟后面你又排到的前缀是一样的，相当于前缀中的前缀）
        // 套娃就是前缀串中有前缀的前缀
        // 然后这些原先算好的前缀可以后面接着用
        // 和理解KMP似的
        else if (cn > 0) {
            cn = next[cn]
        }
        else {
            next[i++] = 0
        }
    }
    return next
}

function KMP(str: string, childStr: string) {
    let i1 = 0;
    let i2 = 0
    const next = getNextArray(childStr)
    while (i1 < str.length && i2 < childStr.length) {
        // 这个就是对的上就两个往后走
        if (str[i1] === childStr[i2]) {
            i1++
            i2++
        }
        // 子字符串上去就匹配不上而且，
        // 子字符串还一个字符没匹配上的时候，大字符串直接往后走
        else if (next[i2] === -1) {
            i1++
        } 
        // 如果子字符串有一定范围被匹配上了，那就让i2跳到之前匹配上那部分              
        else {
            i2 = next[i2]
        }
    }
    return i2 === childStr.length ? i1 - i2 : -1
}