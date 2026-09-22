export type Role =  'employee' | 'coordinator'| 'sector-manager' | 'admin'

export interface AuthUser {
    id: number
    firstname: string
    lastname: string
    roles: Role[]
}