import jwt from 'jsonwebtoken';
import { AppError } from '../shared/app-error.js';

export const authenticate = (req, res, next) => {
    const hd_token = req.cookies.hd_token;

    if(!hd_token) {
        throw new AppError(
            'Authentification requise',
            401,
            'UNAUTHORIZED'
        )
    }

    try {
        const decodedToken = jwt.verify(
            hd_token, 
            process.env.JWT_SECRET
        );

        req.user = decodedToken;

        next();

        
    } catch (error) {
        throw new AppError(
            'Authentification invalide',
            401,
            'UNAUTHORIZED'
        );
    }
};

export const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        const userRoles = req.user.roles;
        
        const hasAccess = userRoles.some(
            (role) => allowedRoles.includes(role)
        );

        if(!hasAccess) {
            throw new AppError(
                'Accès interdit',
                403,
                'FORBIDDEN'
            );
        }

        next();
    };
};