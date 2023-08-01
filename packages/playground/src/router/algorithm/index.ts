import PriorityQueue from "@/views/PriorityQueue";

export const routes = [
    {
        name: 'PriorityQueue',
        path: '/PriorityQueue',
        component: PriorityQueue
    }
]
export const route = {
    name: 'algorithm',
    path: '/algorithm',
    children: routes
}