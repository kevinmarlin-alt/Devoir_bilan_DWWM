import { findRolesByUserId, findUserByEmail } from '../repositories/user.repository.js'
import bcrypt from 'bcrypt'
import { AppError } from '../shared/app-error.js';

export const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if(!user) {
        throw new AppError(
            'Identifiants incorrects',
            401,
            'INVALID_CREDENTIALS'
        );
    }

    const isActived = user.isActive;

    if(!isActived) {
        throw new AppError(
            'Identifiants incorrects',
            401,
            'INVALID_CREDENTIALS'
        );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if(!passwordMatch) {
        throw new AppError(
            'Identifiants incorrects',
            401,
            'INVALID_CREDENTIALS'
        );
    }

    const roles = await findRolesByUserId(user.userAccountId);

    if(roles.length === 0) {
        throw new AppError(
            "Aucun rôle applicatif n'est associé à ce compte",
            403,
            'NO_APPLICATION_ROLE'
        );
    }

    return {
        userAccountId: user.userAccountId,
        email: user.email,
        roles: roles
    };

}

export default {
    authenticateUser
}