import { createRouter, createWebHashHistory } from 'vue-router'
import { route as algorithmRoute } from './algorithm'
import TestPlayground from "@/views/TestPlayground";

const routes = [
    algorithmRoute,
    {
        path: '/:pathMatch(.*)*',
        name: 'error-404',
        component: TestPlayground
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})


