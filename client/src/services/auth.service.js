import { API_URL } from '@/config/api';


export class AuthError extends Error {
    constructor(
        status,
        message
    ) {
        super(message);
        this.name = 'AuthError'
    }
}

export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    if(!response.ok) {
        if(response.status === 401) {
            throw new AuthError(
                401,
                'Adresse e-mail ou mot de passe incorrect'
            );
        }

        if(response.status === 403) {
            throw new AuthError(
                403,
                "Ce compte n'est pas autorisé à accéder à l'application"
            );
        }

        throw new AuthError(
            response.status,
            'Une erreur est survenue pendant la connexion'
        )
    }

    const data = await response.json();

    return data.user;
};

export const logout = async () => {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    });

    if(!response.ok) {
        throw new AuthError(
            response.status,
            'Impossible de se déconnecter'
        );
    }
};

export const getAuthenticatedUser = async () => {
        const response = await fetch(`${API_URL}/api/auth/user`, {
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