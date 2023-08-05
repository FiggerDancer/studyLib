import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import '@/styles/main.css'



function add(a: number, b: number) {
    let sum = a
    while (b !== 0) {
        sum = a ^ b
        b = (a & b) << 1
        a = sum
    }
    return sum
}

function negNum(n: number) {
    return add(~n, 1)
}

function minus(a: number, b: number) {
    return add(a, negNum(b))
}

function multi(a: number, b: number) {
    let res = 0
    while (b !== 0) {
        // b的最后一位是否为0，是0则不加，是1则加上
        if ((b & 1) !== 0) {
            res = add(res, a)
        }
        // a向左移
        a  = a << 1
        // b向右移,无符号
        b >>>= 1
    }
    return res
}

function isNeg(num: number) {
    return num < 0
}

function div(a: number, b: number) {
    let x = isNeg(a) ? negNum(a) : a
    const y = isNeg(b) ? negNum(b) : b
    let res = 0
    for (let i = 31; i > -1; i = minus(i, 1)) {
        if ((x >> i) >= y) {
            res |= (1 << i)
            x = minus(x, y << i)
        }
    }
    return (isNeg(a) === isNeg(b)) ? res : negNum(res) 
}

console.log(div(12,4))

createApp(App)
    .use(router)
    .mount('#app');