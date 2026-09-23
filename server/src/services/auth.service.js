import { findUserByEmail } from '../repositories/user.repository.js'
import bcrypt from 'bcrypt'

export const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if(!user) {
        throw new Error(
            'Identifiants incorrects'
        )
    }

    const isActived = user.isActive;

    if(!isActived) {
        throw new Error(
            'Identifiants incorrects'
        )
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if(!passwordMatch) {
        throw new Error(
            'Identifiants incorrects'
        )
    }

    return {
        userAccountId: user.userAccountId,
        email: user.email,
        isActive: user.isActive
    };

}

export default {
    authenticateUser
}