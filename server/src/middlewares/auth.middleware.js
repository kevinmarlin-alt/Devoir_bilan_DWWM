import jwt from 'jsonwebtoken';
import { AppError } from '../shared/app-error';

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