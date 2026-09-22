const apiUrl = import.meta.env.VITE_API_URL;

if(!apiUrl) {
    throw new Error(
        "La variable d'environnement VIT_API_URL est obligatoire"
    );
}

export const API_URL = apiUrl;