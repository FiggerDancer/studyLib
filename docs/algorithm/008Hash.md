# 哈希函数和哈希表

## 哈希函数

out = f(in)

1. in -> ∞ out -> s md5 $O(2^{64}-1)$ sha1 $O(2^{128} - 1)$
2. 相同的输入必然得到相同的输出，没有任何随机成分
3. 不同的输入可能导致相同的输出（哈希碰撞），因为输入是无限的，输出是有限的

离散性越好（分布越均匀）的哈希函数越好

### 用途

#### 限定内存大文件处理

假设有一个大文件，大文件中都是无符号整数，$0$~$2^{32} - 1$,0~42亿+，现在给你1G内存，返回出现次数最多的数

Hash表  key(int) 4B, value(int) 4B 次数 最差情况需要32G内存

通过哈希函数，把每个数哈希函数处理后生成的数字模上100，得出0-99的数字，发送到100个小文件里，对于每一个小文件使用哈希表，这样内存就不会暴，每个小文件使用32G/100内存，每个小文件单独统计，统计完一个统计下一个（哈希函数相同的值一定进同一个文件了，不同数的值一定均分了）

## 哈希表生成

你加值得时候生成的都是均匀分布的哈希值，当其中某个哈希值分配的数值过多，超过阈值K，就扩容，扩容的次数为 $O(\log_{N})$ ，全要重新计算哈希值，全部重新挂，$O(N)$ 代价,总的扩容代价 $O(N\log_{N})$。哈希表在使用增删改查过程中在理论上是O(n)级别的，但是实际使用中可以认为是O(1)级别的

### 题

#### 设计RandomPool结构

【题目】  
设计一种结构，在该结构中有如下三个功能:  
insert (key):将某个key加入到该结构，做到不重复加入delete(key):将原本在结构中的某个key移除  
getRandom() :等概率随机返回结构中的任何一个key。【要求】  
insert、 delete和getRandom方法的时间复杂度都是0(1)  

```js
class RandomPool {
    constructor() {
        // str => index
        this.keyIndexMap = new Map()
        // index => str
        this.indexKeyMap = new Map()
    }
    insert(key) {
        const size = this.keyIndexMap.size
        this.keyIndexMap.set(key, size)
        this.indexKeyMap.set(size, key)
    }
    delete(key) {
        const size = this.keyIndexMap.size
        const lastIndex = size - 1
        const lastKey = this.indexKeyMap.get(lastIndex)
        const index = this.keyIndexMap.get(key)
        this.keyIndexMap.set(lastKey, index)
        this.indexKeyMap.set(index, lastKey)
        this.keyIndexMap.delete(key)
        this.indexKeyMap.delete(size - 1)
    }
    getRandom() {
        const random = Math.floor(this.keyIndexMap.size * Math.random())
        return this.indexKeyMap.get(random)
    }
}
```

#### 布隆过滤器

解决类似黑名单系统或者爬虫去重

黑名单：  
100亿 url的大文件（每个url64B）  
经典 HashSet 6400亿B，640G内存  

爬虫去重:
爬某个网站，要深度遍历其内部的url，开了1000个线程，这时候需要防止线程访问同一个url

失误类型  

1. 黑名单->白名单 ×
2. 白名单->黑名单（万分之一）

布隆过滤器存在一定失误，但是可以使内存使用变得很低，只存在白名单误识别为黑名单，可以通过人工干预的方式降低到万分之一。失误率是不可避免的。

准备一个m位的位图，如何往里放呢？  
url1，通过hash1函数，生成out1，然后%m，然后通过hash2函数，生成out2，然后%m，总共通过k个hash函数，生成k个out，最终值放到位图中，然后你去查黑名单的时候，如果通过这个k个hash函数都命中了，那说明就是黑名单，一个不黑就认为不是黑名单的。

失误率位图大小起决定性作用，K也起作用，k太大或太小都会导致失误率过大

![失误率与M和K的关系](https://cdn.jsdelivr.net/gh/lxy951101/chart-bed/assets20230802025537.png)

::: warn  
布隆过滤器只和这个有关:n样本量，p失误率;(单样本大小无关)  
::: warn  

##### 公式

$m = -\frac{n * lnP}{(ln_{2})^{2}}$  

$k = \frac{m}{n} *ln_{2}  \approx \frac{m}{n}*0.7$  

$p_{\text{真}} = 1 - e^{-\frac{n *k_{\text{真}}}{m_{\text{真}}}}$

##### 位图

位图 bit arr，bit map

int[] 100 4字节 32bit 400字节
long[] 100 8字节 64bit 800字节
bit[] 100 1bit 12.5字节

###### 如何做比特数组？

拿基础类型拼

```js
class BitArray {
    constructor() {
        // 用数字 ，1个数字是一个32位数
        this.arr = []
    }
    get(pos) {
        const arr = this.arr
        // 把pos位的状态拿出来
        const numIndex = pos / 32; // 定位出这个位在哪个数上
        const bitIndex = pos % 32;
        return (arr[numIndex] >> (bitIndex)) & 1
    }
    set(pos, value) {
        const arr = this.arr
        const numIndex = 178 / 32; // 定位出这个位在哪个数上
        const bitIndex = 178 % 32;
        if (value === 1) {
            // 请把178位的状态改为1
            arr[numIndex] = arr[numIndex] | (1 << (bitIndex))
        } else {
            // 请把178位的状态改为0
            arr[numIndex] = arr[numIndex] & (~ (1 << bitIndex))
        }
    }
}
```

## 一致性哈希原理

为了扩容时，降低数据迁移的成本

### 应用场景：分布式服务器

逻辑服务器 对于不同的key通过hash取模，找到对应的数据服务器  
数据服务器

key的选择一定要保证低频、高频、中频都有数量，这样才能做到负载均衡

增加机器或者减少机器时，数据的迁移时全量的，代价很高，所以需要哈希一致性

### 实现

构建一个哈希环，平均分布数据服务器，获取哈希值顺时针最近的那一台

加新的机器时，可以只迁移一台机器的

减机器的时候，也只需要迁移一台机器的

问题1： 机器少的时候如何均分环，如何做到负载均衡？  
使用虚拟节点技术  
m1分配1000个节点，m2也是，m3也是  让这些点去抢环  
新增机器的时候则让m4来抢环，也是1000个节点  

而且一致性哈希可以分配单个数据服务器的节点个数，性能好的可以多分配
