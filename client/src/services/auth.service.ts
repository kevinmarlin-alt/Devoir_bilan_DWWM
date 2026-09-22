import type { AuthUser, Role } from '@/types/auth.type';

const HOST = 'http://localhost:3000'

interface User {
    id: number
    email: string
    fisrtname?: string
    lastname?: string
    roles: Role[]
}

export let User: User 

export const getAuthenticatedUser = async (): Promise<User | null> => {
        const response = await fetch(`${HOST}/api/auth/user`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 401) {
            return null;
        }

        if (!response.ok) {
            throw new Error(
                "Impossible de vérifier l'authentification"
            );
        }

        const data = await response.json();

        return data.user;
    };