import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import '@/styles/main.css'

createApp(App)
    .use(router)
    .mount('#app');

function getWays1(arr: number[], aim: number) {
        const n = arr.length
        const dp = new Array(n + 1).fill(0).map(() => new Array(aim + 1).fill(0))
        dp[n][0] = 1
        for (let index = n - 1; index >= 0; index--) {
            for (let rest = 0; rest <= aim; rest++) {
                let ways = 0
                for (let zhang = 0; arr[index] * zhang <= rest; zhang++) {
                    ways += dp[index + 1][rest - arr[index] * zhang]
                }
                dp[index][rest] = ways
            }
        }
        return dp[0][aim]
    }


function getWays(arr: number[], aim: number) {
    const n = arr.length
    const dp = new Array(n + 1).fill(0).map(() => new Array(aim + 1).fill(0))
    dp[n][0] = 1
    for (let index = n - 1; index >= 0; index--) {
        for (let rest = 0; rest <= aim; rest++) {
            // 这一行前面的值，也是通过下面的值进行计算的也就说，这些东西已经算过一遍了
            // 这里可以直接通过该值下面的值和左边的上个值相加取得
            dp[index][rest] = dp[index + 1][rest]
            if (rest - arr[index] >= 0) {
                dp[index][rest] += dp[index][rest - arr[index]]
            }
        }
    }
    console.log(dp)
    return dp[0][aim]
}

console.log(getWays1([1,5,3,2], 10), getWays([1,5,3,2], 10))

