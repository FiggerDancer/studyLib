# 前缀树

```js
class TrieNode {
    constructor () {
        // 路过该字符的单词个数
        this.pass = 0
        // 以此字符为结尾的单词个数
        this.end = 0
        this.nexts = []
    }
}

class Trie () {
    constructor() {
        this.root = new TrieNode()

    }

    insert(word) {
        if (word === null) {
            return
        }
        let node = this.root
        let index = 0
        for (let i = 0; i < word.length; i++) {
            index = word[i] - 'a'
            if (node.nexts[index] === null) {
                node.nexts[index] = new TrieNode()
            }
            node = node.nexts[index]
            node.pass++
        }
        node.end++
    }

    delete(word) {
        if (search(word) !== 0) {
            let node = this.root
            let index = 0
            for (let i = 0; i < word.length; i++) {
                index = word[i] - 'a'
                node = node.nexts[index]
                node.pass--
            }
            node.end--
        }
    }

    // word这个单词加入了多少次
    search(word) {
        if (word === null) {
            return 0
        }
        let node = this.root
        let index = 0
        for (let i = 0; i < word.length; i++) {
            index = word[i] - 'a'
            if (--node.nexts[index].pass === 0) {
                node.nexts[index] = null
                // 如果只有一个路过的要减的直接把这个减的一删除后面不用看了，都是这个单词的
                return
            }
            node = node.nexts[index]
        }
        return node.end
    }

    // 以此为前缀的单词数
    prefixNumber(pre) {
        if (pre === null) {
            return 0
        }
        let node = this.root
        let index = 0
        for (let i = 0; i < word.length; i++) {
            index = word[i] - 'a'
            if (node.nexts[index] === null) {
                return 0
            }
            node = node.nexts[index]
        }
        return node.pass
    }
}

```
