# lodash

## throtle

```js
function throlte(fn, time) {
    let timer
    const myFunc = function(...rest) {
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            fn(...rest)
            timer = null
        }, time)
    }
    return myFunc
}
```

## debounce

```js
function debounce(fn, time) {
    let timer
    const myFunc = function(...rest) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn(...rest)
            timer = null
        }, time)
    }
    return myFunc
}
```

## cloneDeep

```js
function isObject(target) {
    return typeof target === 'object' && target != null
}

function getType(target) {
    return Object.prototype.toString.call(target)
}

const canTraverse = {
    '[object Map]': true,
    '[object Set]': true,
    '[object Array]': true,
    '[object Object]': true,
    '[object Arguments]': true,
}

function handleRegExp(target) {
    const { source, flags } = target
    return new target.prototype(source, flags)
}

function handleFunc(target) {
    if (!func.prototype) return func
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\))\s+{/;
    const funcString = func.toString();
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (!body) return null
    if (param) {
        const paramArr = param[0].split(',')
        return new Function(...paramArr, body[0])
    }
    return new Function(body[0])
}

function handleNotTraverse(target, type) {
    const Ctor = target.prototype
    if (type ==='[object Boolean]') {
        return new Object(Boolean.prototype.valueOf.call(target))
    } else if (type === '[object Number]') {
        return new Object(Number.prototype.valueOf.call(target))
    } else if (type === '[object String]') {
        return new Object(String.prototype.valueOf.call(target)) 
    } else if (type === '[object Symbol]') {
        return new Object(Symbol.prototype.valueOf.call(target))
    } else if (type === '[object RegExp]') {
        return handleRegExp(target)
    } else if (type === '[object Function]') {
        return handleFunc(target)
    } else {
        return new Ctor(target)
    }
}

function cloneDeep(target, map = new WeakMap()) {
    if (!isObject(target)) return target
    const type = getType(target)
    let cloneTarget
    if (!canTraverse[type]) {
        return handleNotTraverse(target, type)
    } else {
        let ctor = target.constructor
        cloneTarget = new ctor()
    }
    if (cloneTarget = map.get(target)) {
        return cloneTarget
    }
    if (type === '[object Map]') {
        target.forEach((item, key) => {
            cloneTarget.set(deepClone(key, map), deepClone(item, map))
        })
    } else if (type === '[object Set]') {
        target.forEach((item) => {
            cloneTarget.add(deepClone(item, map))
        })
    } else {
        for (let prop in target) {
            if (target.hasOwnProperty(prop)) {
                cloneTarget[prop] = deepClone(target[prop], map)
            }
        }
    }
    map.set(target, cloneTarget)
    return cloneTarget
}
```

## isEqual

```js
function isObject(target) {
    return typeof target === 'object' && target != null
}

function getType(target) {
    return Object.prototype.toString.call(target)
}

const canTraverse = {
    '[object Map]': true,
    '[object Set]': true,
    '[object Array]': true,
    '[object Object]': true,
    '[object Arguments]': true,
}

function handleRegExp(target1, target2) {
    const { source, flags } = target
    const { source: source2, flags: flags2 }
    return source === source2 && flags === flags2
}

function handleFunc(func, func2) {
    if (!func.prototype) return func
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\))\s+{/;
    const funcString = func.toString();
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    const funcString2 = func2.toString();
    const param2 = paramReg.exec(funcString2);
    const body2 = bodyReg.exec(funcString2);
    return param === param2 && body === body2
}

function handleNotTraverse(target1, target2, type) {
    const Ctor = target.prototype
    if (type ==='[object Boolean]') {
        return Boolean.prototype.valueOf.call(target1) === Boolean.prototype.valueOf.call(target2)
    } else if (type === '[object Number]') {
        return (Number.prototype.valueOf.call(target)) === Number.prototype.valueOf.call(target2)
    } else if (type === '[object String]') {
        return (String.prototype.valueOf.call(target)) === String.prototype.valueOf.call(target2)
    } else if (type === '[object Symbol]') {
        return (Symbol.prototype.valueOf.call(target)) === Symbol.prototype.valueOf.call(target2)
    } else if (type === '[object RegExp]') {
        return handleRegExp(target1, target2)
    } else if (type === '[object Function]') {
        return handleFunc(target1, target2)
    } else {
        return target1 === target2
    }
}

function isEqual(target1, target2, map = new WeakMap()) {
    if (!isObject(target)) return target1 === target2
    const type = getType(target)
    let result
    if (!canTraverse[type]) {
        return handleNotTraverse(target, type)
    } else {
        result = true
    }
    if (equalResult = map.get(target1)?.get(target2)) {
        return equalResult
    } else if (equalResult !== void 0) {
        return false
    }
    
    if (type === '[object Map]') {
        for (const [value, key] of target1.entries()) {
            if (!isEqual(value, target2.get(key), map)) {
                result = false
                break;
            }
        }
    } else if (type === '[object Set]') {
        const values1 = target1.values()
        const values2 = target2.values()
        for (let i = 0; i < values.length; i++) {
            if (!isEqual(values1[i], values2[i], map)) {
                result = false
                break
            }
        }
    } else {
        for (let prop in target1) {
            if (target1.hasOwnProperty(prop)) {
                if (!isEqual(target1[prop], target2[prop], map)) {
                    result = false
                    break;
                }
            }
        }
    }
    let target2Map = map.get(target1)
    if(!target2Map) {
        target2Map = new WeakMap()
        map.set(target1, target2Map)
    }
    target2Map.set(target2, result)
    return result
}
```

## get

```js
// a[3].b -> a.3.b -> [a, 3, b]
function lodashGet(path, source, defaultValue = void 0) {
    const paths = path.replace(/\[['"]?(\w+)['"]?\]/g, '.$1').split('.')
    let result
    for (const path1 of paths) {
        result = source?.[path1]
    }
    return result === void 0 ? defaultValue : result
}
```

## composeRight

```js
function compose(...rest) {
    return rest.reduce((pre, cur) => {
        return (...args) => pre(cur(...args))
    })
}
```

## composeLeft

```js
function compose(...rest) {
    return rest.reduce((pre, cur) => {
        return (...args) => cur(pre(...args))
    })
}
```

## shuffle

```js
function shuffle(arr) {
    let len = arr.length
    while (len) {
        const random = Math.floor(Math.random() * len--)
        [arr[random], arr[len]] = [arr[len], arr[random]]
    }
    return arr
}
```

## sampleSize

```js
function sampleSize(list, n) {
    return shuffle(list.slice()).slice(n)
}
```

## maxBy

### 单个项

```js
function maxBy(list, keyBy) {
    return list.reduce((pre, cur) => {
        const key = keyBy(pre)
        const key2 = keyBy(cur)
        if (key > key2) {
            return pre
        }
        return cur
    })
}
```

### 多个项

```js
function maxBy(list, keyBy) {
    if (list.length < 2) return list.slice(0, 1)
    return list.reduce((pre, cur) => {
        const key = keyBy(pre[0])
        const key2 = keyBy(cur)
        if (key === key2) {
            return [...pre, cur]
        }
        if (key > key2) {
            return pre
        }
        return [cur]
    }, [list[0]])
}
```

## keyBy

```js 实现效果
// Output: {
//   "1": {
//     "id": 1,
//     "name": "山月"
//   },
//   "2": {
//     "id": 2,
//     "name": "shanyue"
//   }
// }
keyBy([{ id: 1, name: '山月' }, { id: 2, name: 'shanyue' }], x => x.id)
```

```js
function keyBy(list, by) {
    return list.reduce((pre, item) => {
        pre[by(item)] = item
        return pre
    }, {})
}
```

## groupBy

```js 效果
groupBy([
  { id: 1, name: '山月', sex: 'male' },
  { id: 2, name: '张三', sex: 'female' },
  { id: 3, name: '李四', sex: 'female' }
], x => x.sex)
```

```js
function groupBy(list, by) {
    return list.reduce((pre, cur) => {
        const byRet = by(cur)
        if (!pre[byRet]) {
            pre[byRet] = []
        }
        pre[byRet].push(cur)
        return pre
    }, {})
}
```

## chunk

```js
function chunk(list, size) {
    const res = []
    for (let i = 0; i < list.length; i++) {
        const index = Math.floor(i / size)
        res[index] ??= [];
        res[index].push(list[i])
    }
    return res
}
```

## once

```js
function once(fn) {
    let invoked = false
    let result
    function myFunc(...rest) {
        if (invoked) return result
        invoked = true
        result = fn.call(this, ...rest)
        return result
    }
    return myFunc
}
```

## template

```js
const STATUS = {
    inBracket: 1,
    default: 0,
}

function render(template, data) {
    let source = template
    const len = source.length
    const stack = []
    const token = []
    let i = 0
    while (i < len) {
        if (source.startsWith('\{\{', i)) {
            let str = ''
            while (stack[stack.length - 1] !== '\{\{') {
                const top = stack.pop()
                str = top + str
            }
            token.push({
                type: 'TEXT',
                content: str,
            })
            stack.push('\{\{')
            i += 2
        } 
        else if (source.startsWith('\}\}', i)) {
            let str = ''
            while (stack[stack.length - 1] !== '\{\{') {
                const top = stack.pop()
                str = top + str
            }
            token.push({
                type: 'VALUE',
                content: str,
            })
            i += 2
        }
        else {
            stack.push(source[i])
            i++
        }
    }

    return token.map((singleToken) => {
        if (singleToken.type === 'VALUE') {
            return lodashGet(singleToken.content, data, '')
        }
        return singleToken.content
    }).join('')
}
```

## pickBy

```js
function pickBy(obj, by) {
    return Object.keys(obj).reduce((pre, cur) => {
        const bool = by(obj[cur])
        if (bool) {
            pre[key] = obj[cur]
        }
        return pre
    }, {})
}
```

## omitBy

```js
function omitBy(obj, by) {
    return Object.keys(obj).reduce((pre, cur) => {
        const bool = by(obj[cur])
        if (!bool) {
            pre[key] = obj[cur]
        }
        return pre
    }, {})
}
```

## camelCase

```js
function camelCase(str) {
    return str.replace(/-(\w+)/g, function(a, c) {
        return c.substring(0, 1).toUpperCase() + c.substring(1)
    })
}

function kebabCase(str) {
    return str.replace(/([A-Z])/g, function(a, c) {
        return `-${c.toLowerCase()}`
    })
}
```

## difference

```js
function difference(...list) {
    const map = new Map()
    list.forEach((_list) => {
        _list.forEach((item) => {
            if (!map.has(item)) {
                map.set(item, 1)
            } else [
                map.set(item, map.get(item) + 1)
            ]
        })
    })
    const result = []
    for (const [value, key] of map.entries()) {
        if (value === 1) {
            result.push(key)
        }
    }
    map.clear()
    return result
}
```

## intersection

```js
const intersection = (...list) => {
    const result = list.reduce((x, y) => x.filter(i => y.includes(i)))
    return [...new Set(result)]
}
```

## isEmpty

```js
function isEmpty(obj) {
    return Reflect.ownKeys(target).length === 0
}

```
