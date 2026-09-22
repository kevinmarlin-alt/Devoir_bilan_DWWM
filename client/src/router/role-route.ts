import type { Role } from "@/types/auth.type";

export  const dashboardRouteByRole: Record<Role, string> = {
    admin: 'admin-dashboard',
    sector_manager: 'sector-manager-dashboard',
    coordinator: 'coordinator-dashboard',
    employee: 'employee-dashboard'
};

const rolePriority: Role[] = [
    'admin',
    'sector_manager',
    'coordinator',
    'employee'
];

export function getDashboardRouteName(
    roles: Role[]
): string | null {
    const role = rolePriority.find((role) => roles.includes(role));

    if(!role) {
        return null;
    }

    return dashboardRouteByRole[role]
}