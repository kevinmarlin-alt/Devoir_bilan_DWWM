export  const dashboardRouteByRole = {
    admin: 'admin-dashboard',
    sector_manager: 'sector-manager-dashboard',
    coordinator: 'coordinator-dashboard',
    employee: 'employee-dashboard'
};

const rolePriority = [
    'admin',
    'sector_manager',
    'coordinator',
    'employee'
];

export function getDashboardRouteName(roles) {
    const role = rolePriority.find((role) => roles.includes(role));

    if(!role) {
        return null;
    }

    return dashboardRouteByRole[role]
}