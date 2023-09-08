import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import '@/styles/main.css'

createApp(App)
    .use(router)
    .mount('#app');

function throttle(time) {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value
        let timer
        descriptor.value = function(...rest: any[]) {
            if (timer) {
                return
            }
            timer = setTimeout(() => {
                oldValue.call(this, ...rest)
                timer = null
            }, time)
        }
        return descriptor
    }
}


class ABC {
    @throttle(500)
    say() {
        console.log('2334545')
    }
}

const a = new ABC()

a.say()
a.say()

a.say()