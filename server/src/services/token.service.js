import jwt from 'jsonwebtoken';

export const createAuthToken = (user) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET est manquant');
    }

    return jwt.sign(
        {
            userAccountId: user.userAccountId,
            email: user.email,
            roles: user.roles
        },
        secret,
        {
            expiresIn: '8h'
        }
    );
};