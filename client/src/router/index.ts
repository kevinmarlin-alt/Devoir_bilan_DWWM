import AppLayout from '@/layouts/AppLayout.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import LoginView from '@/views/LoginView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import EmployeeDashboardView from '@/views/employee/EmployeeDashboardView.vue';
import CoordinatorDashboardView from '@/views/coordinator/CoordinatorDashboardView.vue';
import ManagerDashboardView from '@/views/sector_manager/ManagerDashboardView.vue';
import AdminDashboardView from '@/views/amdin/AdminDashboardView.vue';
import { getAuthenticatedUser } from '@/services/auth.service';
import type { Role } from '@/types/auth.type';

const applicationName = 'Harmonie Domicile'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: { name: 'login' }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { title: 'Connexion' }
        },
        {
            path: '/employee',
            component: AppLayout,
            meta: { requiresAuth: true, roles: ['employee'] },
            children: [
                {
                    path: 'dashboard',
                    name: 'employee-dashboard',
                    component: EmployeeDashboardView,
                    meta: { title: 'Tableau de bord' }
                }
            ]
        },
        {
            path: '/coordinator',
            component: AppLayout,
            meta: { requiresAuth: true, roles: ['coordinator'] },
            children: [
                {
                    path: 'dashboard',
                    name: 'coordinator-dashboard',
                    component: CoordinatorDashboardView,
                    meta: { title: 'Tableau de bord' }
                }
            ]
        },
        {
            path: '/sector-manager',
            component: AppLayout,
            meta: { requiresAuth: true, roles: ['sector-manager'] },
            children: [
                {
                    path: 'dashboard',
                    name: 'sector-manager-dashboard',
                    component: ManagerDashboardView,
                    meta: { title: 'Tableau de bord' }
                }
            ]
        },
        {
            path: '/admin',
            component: AppLayout,
            meta: { requiresAuth: true, roles: ['admin'] },
            children: [
                {
                    path: 'dashboard',
                    name: 'admin-dashboard',
                    component: AdminDashboardView,
                    meta: { title: 'Tableau de bord' }
                },
                {
                    path: 'dashboard/test',
                    name: 'admin-dashboard2',
                    component: AdminDashboardView,
                    meta: { title: 'Tableau de bord' }
                }
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFoundView
        }
    ]
});

router.beforeEach(async (to) => {
    const user = await getAuthenticatedUser()
    //console.log('beforeEach:', user, to.meta.requiresAuth)
    

    if (to.meta.requiresAuth && !user) {
        return {
            path: '/login',
            query: { redirect: to.fullPath }
        }
    }

    const allowedRoles = to.meta.roles as Role[] | undefined;

    //console.log('beforeEach - allowedRoles:', allowedRoles)

    if(allowedRoles) {
        const hasAccess = user?.roles.some(role => allowedRoles.includes(role));
        //console.log('beforeEach - hasAccess:', hasAccess)

        if(!hasAccess) {
            return { name: 'login' };
        }
    }

})

router.afterEach((to) => {
    const pageTitle = typeof to.meta.title === 'string' 
        ? to.meta.title 
        : null

    document.title = pageTitle 
        ? `${pageTitle} | ${applicationName}` 
        : applicationName
});

export default router;
