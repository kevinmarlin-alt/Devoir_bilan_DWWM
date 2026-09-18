import AppLayout from "@/layouts/AppLayout.vue";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import LoginView from "@/views/LoginView.vue";
import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView
                }
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            name: "not-found",
            component: NotFoundView
        }
    ]
})

export default router;